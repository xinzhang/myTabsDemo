
angular.module('app').factory('AppSettings', function () {
    return {
        dashboardType: 'G',
        enableLocation: false,
        showMap: false   
    }

});

angular.module('app').controller('AppSettingsCtrl', ['AppSettings', '$scope', '$ionicLoading', 'localStorageService', '$state',
        function (AppSettings, $scope, $ionicLoading, localStorageService, $state) {
            $scope.settings = AppSettings;

            $scope.mapCreated = function (map) {
                $scope.map = map;
            };

            // share anywhere
            $scope.share = function () {
                $cordovaSocialSharing.share('This is my message', 'Subject string', null, 'http://www.mylink.com');
            }

            // Share via email. Can be used for feedback
            $scope.sendFeedback = function () {
                $cordovaSocialSharing
                        .shareViaEmail('Some message', 'Some Subject', 'to_address@gmail.com');
            }

            // Share via SMS. Access multiple numbers in a string like: '0612345678,0687654321'
            $scope.sendSMS = function (message, number) {
                $cordovaSocialSharing.shareViaSMS(message, number);
            }

            $scope.signout = function () {
                localStorageService.remove('username');
                $state.go('introduction');
            }

        }
]);

angular.module('app').controller('AccountSettingsCtrl', ['AppSettings', '$scope', '$ionicLoading', 'localStorageService',
    function (AppSettings, $scope, $ionicLoading, localStorageService) {
            $scope.settings = AppSettings;
            active();

            function active() {
                $scope.username = localStorageService.get('username');
            }
    }
]);

angular.module('app').controller('ExpenseTypesSettingsCtrl', ['AppSettings', '$scope', '$ionicLoading', 'localStorageService', '$ionicPopup',
    function (AppSettings, $scope, $ionicLoading, localStorageService, $ionicPopup) {

        var initExpTypes = [
            "coffee",
            "drinks",
            "grocery",
            "lunch",
            "bar",
            "restaruant",
            "breakfast",
            "dinner",
            "entertainment",
            "other"
        ];

        active();

        function active() {
            var expTypes = localStorageService.get('expense.types');
            if (expTypes == null) {
                $scope.expenseTypes = initExpTypes;
            }
            else {
                $scope.expenseTypes = expTypes;
            }
        }

        $scope.delete = function (item) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Expense Type',
                template: 'Are you sure you want to delete this expense type?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    var expTypes = $scope.expenseTypes;

                    var pos = 0;
                    for (var i = 0; i < expTypes.length; i++) {
                        if (expTypes[i] == item) {
                            pos = i;
                            break;
                        }
                    }
                    expTypes.splice(pos, 1);

                    localStorageService.set('expense.types', expTypes);

                    $scope.expenseTypes = expTypes;
                    
                } else {
                }
            });
        }

        $scope.edit = function (item) {
            $scope.data = {};
            $scope.data.oldItem = item;
            $scope.data.newItem = item;

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.newItem">',
                title: 'Enter the expense type',
                subTitle: '',
                scope: $scope,
                buttons: [
                  { text: 'Cancel' },
                  {
                      text: '<b>Save</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          if (!$scope.data.newItem) {
                              //don't allow the user to close unless he enters wifi password
                              e.preventDefault();
                          } else {
                              return $scope.data;
                          }
                      }
                  },
                ]
            });

            myPopup.then(function (data) {
                if (!data.newItem)
                    return;

                var expTypes = $scope.expenseTypes;

                var pos = 0;
                for (var i = 0; i < expTypes.length; i++) {
                    if (expTypes[i] == data.oldItem) {
                        expTypes[i] = data.newItem;
                        break;
                    }
                }

                localStorageService.set('expense.types', expTypes);
                $scope.expenseTypes = expTypes;
            });
        }

        // Triggered on a button click, or some other target
        $scope.add = function () {
            $scope.data = {};

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.item">',
                title: 'Enter the expense type',
                subTitle: '',
                scope: $scope,
                buttons: [
                  { text: 'Cancel' },
                  {
                      text: '<b>Save</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          if (!$scope.data.item) {
                              //don't allow the user to close unless he enters wifi password
                              e.preventDefault();
                          } else {
                              return $scope.data.item;
                          }
                      }
                  },
                ]
            });

            myPopup.then(function (item) {
                if (!item)
                    return;

                var expTypes = $scope.expenseTypes;

                var pos = 0;
                for (var i = 0; i < expTypes.length; i++) {
                    if (expTypes[i] == item) {
                        pos = i;
                        return;
                    }
                }
                expTypes.push(item)

                localStorageService.set('expense.types', expTypes);

                $scope.expenseTypes = expTypes;
            });
        }
    }
]);
