
angular.module('app')


.controller('ExpensesCtrl', function ($rootScope, $scope, $ionicPopup, ExpenseService,$ionicLoading) {

    active();

    function active() {
        $ionicLoading.show({ template: 'Loading...' });
        ExpenseService.getFirebaseExpenses().then(function (data) {
            refresh(data);
            $ionicLoading.hide();
        })
    }

    function refresh(data) {
        if (data == null)
            return;

        $scope.expenses = data;

        angular.forEach($scope.expenses, function (value, key) {
            value.transactionDate = new Date(value.transactionDateTime);

            if (value.transactionDate != undefined) {
                value.groupDate = moment(value.transactionDate).format('YYYY-MM-DD');
            }
        });

        $scope.$broadcast('scroll.refreshComplete');

        //ExpenseService.getFirebaseExpenses()
        //       .then(function (response) {
        //           //$scope.expenses = ExpenseService.expenses;
        //           $scope.expenses = response;
        //       }, function (err) {
        //           $ionicPopup.alert(err);
        //       })
    };      

    //$scope.expenses = ExpenseService.expenses;
    
    $rootScope.$on('expense.change', function (event, data) {
        refresh(data);
    })

    $scope.searchText = '';

    $scope.dateRange = "";

    $scope.dateFilterExpense = function (column) {
        $scope.dateRange = column;
    }

    $scope.deleteAll = function () {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Expenses',
            template: 'Are you sure you want to delete all expenses'
        });

        confirmPopup.then(function (res) {
            if (res) {
                ExpenseService.deleteAll();
                $scope.refresh();
            } else {
            }
        });

    }

    $scope.delete = function (datakey) {
        ExpenseService.deleteItem(datakey);
    }

    $scope.refresh = function () {
        active();
    }
})

.controller('ExpenseAddCtrl', function ($scope, $ionicPopup, ExpenseService, AppSettings, $ionicViewService, $state, $stateParams, localStorageService, $firebaseArray, $cordovaCamera) {
    $scope.expense = ExpenseService.addNew();
    $scope.expenseTypes = ExpenseService.expenseTypes;
    $scope.settings = AppSettings;
    $scope.title = "Add Expense";
    $scope.expensekey = null;

    if ($stateParams.expensekey) {        
        $scope.expensekey = $stateParams.expensekey;

        ExpenseService.getExpense($scope.expensekey).then(function (data) {
            $scope.expense = data;
            $scope.expense.transactionDate = new Date(data.transactionDateTime);
        });

    }

    active();

    function active() {
        $scope.$watch("expense.transactionDate", function (newvalue, oldvalue) {
            $scope.expense.groupDate = moment(newvalue).format('YYYY-MM-DD');
        });
    }
    

    $scope.mapCreated = function (map) {
        $scope.map = map;
        $scope.lat = $scope.map.getCenter().lat();
        $scope.lng = $scope.map.getCenter().lng();

        console.log($scope.lat + "," + $scope.lng);
    };

    $scope.save = function () {
        console.log($scope.expense.transactionDate);
        console.log($scope.expense.amount);

        ExpenseService.save($scope.expense);
        $state.go('tab.expenses');
    }    

    $scope.openDatePicker = function () {
        $scope.tmp = {};
        $scope.tmp.newDate = new Date();

        var birthDatePopup = $ionicPopup.show({
            template: '<datetimepicker ng-model="tmp.newDate" data-datetimepicker-config="{ startView:\'day\', minView:\'day\' }" ></datetimepicker>',
            title: "Birth date",
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      $scope.expense.transactionDate = $scope.tmp.newDate;
                      $scope.expense.groupDate = moment($scope.tmp.newDate).format('YYYY-MM-DD');;
                  }
              }
            ]
        });
    }

})

.controller('ExpenseDetailCtrl', function ($scope, $ionicPopup, ExpenseService, AppSettings, $ionicViewService, $state, $stateParams, localStorageService, $firebaseArray, $cordovaCamera, $ionicActionSheet) {
    
    $scope.settings = AppSettings;
    $scope.title = "Detail";

    $scope.expensekey = null;
    $scope.imagesSelected = [];
    $scope.selectedCount = 0;

    if ($stateParams.expensekey) {        
        $scope.expensekey = $stateParams.expensekey;

        ExpenseService.getExpense($scope.expensekey).then(function (data) {
            $scope.expense = data;
            $scope.expense.transactionDate = new Date(data.transactionDateTime);
        });

        if ($scope.expensekey != null) {
            var username = localStorageService.get('username');
            var ref = new Firebase("https://xzexpenses.firebaseio.com/" + username + '/images/');
            var syncArray = $firebaseArray(ref.child($scope.expensekey));
            $scope.images = syncArray;

            $scope.images.$loaded(function () {
                for (var i = 0; i < $scope.images.length; i++)
                {
                    $scope.imagesSelected.push({selected: false});
                }
            });
        }
    }

    active();

    function active() {
    }    

    $scope.switchSelection = function (idx) {
        $scope.imagesSelected[idx].selected = !$scope.imagesSelected[idx].selected;
        if ($scope.imagesSelected[idx].selected)
            $scope.selectedCount = $scope.selectedCount + 1;
        else
            $scope.selectedCount = $scope.selectedCount - 1;
    }

    $scope.actionSheet = function() {
        if ($scope.selectedCount == 0)
        {
            $ionicPopup.alert({
                title: 'Warning',
                template: 'Please select images first. '
            });

            return;
        }

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Share(' + $scope.selectedCount + ')' }
            ],
            destructiveText: 'Delete(' + $scope.selectedCount + ')',
            titleText: 'Modify your album',
            cancelText: 'Cancel',
            cancel: function() {
                    // add cancel code..
            },

            buttonClicked: function(index) {
                console.log('buttonclicked' + index);
                return true;
            },

            destructiveButtonClicked : function() {
                //$scope.images[0].$$hashKey
                var selectedHashkey = [];

                for (var i = 0; i < $scope.imagesSelected.length; i++)
                {
                    if ($scope.imagesSelected[i].selected)
                    {
                        selectedHashkey.push($scope.images[i]);
                    }
                }

                for (var i=0; i<selectedHashkey.length; i++)
                {
                    $scope.images.$remove(selectedHashkey[i]);
                }   
                return true;
            }
        });
    }

    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
            };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            syncArray.$add({image: imageData}).then(function() {
                // $ionicPopup.alert({
                //     title: 'Confirm',
                //     template: 'Image has been uploaded'
                // });
            });
        }, function(error) {
            console.error(error);
        });

    }

    
        
})