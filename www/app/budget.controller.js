
angular.module('app')

.controller('BudgetCtrl', function ($rootScope, $scope, $ionicPopup, BudgetService) {
    
    active();

    function refreshData() {
        var curr = new Date();
        var from, to;

        if ($scope.budget.type == 'weekly') {
            from = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
            to = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
        }

        if ($scope.budget.type == 'monthly') {
            from = new Date(curr.getFullYear(), curr.getMonth(), 1 + $scope.budget.monthlyStartDay - 1);
            to = new Date(curr.getFullYear(), curr.getMonth() + 1, $scope.budget.monthlyStartDay - 1);
        }

        $scope.from = moment(from).format('YYYY-MM-DD');
        $scope.to = moment(to).format('YYYY-MM-DD');
    };


    function active() {
        BudgetService.getFirebaseBudget().then(function (data) {
            $scope.budget = data;
            refreshData();
        });        
    }

    $rootScope.$on('budget.change', function (event, data) {
        $scope.budget = data;
        console.log(data); // 'Emit!'
        active();
    });
})

.controller('BudgetAddCtrl', function ($scope, $ionicPopup, BudgetService, AppSettings, $ionicViewService, $state) {
    $scope.BudgetTypes = ['monthly', 'weekly'];
    $scope.Days = [];

    for (var i = 1; i < 31; i++)
    {
        $scope.Days.push(i);
    }

    active();

    function active() {
        BudgetService.getFirebaseBudget().then(function (data) {
            $scope.budget = data;
        });        
    }

    $scope.save = function () {
        BudgetService.save($scope.budget);
        $state.go('tab.budget');
    }
    
})