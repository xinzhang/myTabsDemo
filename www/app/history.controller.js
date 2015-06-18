angular.module('app')


.controller('HistoryCtrl', function ($rootScope, $scope, $ionicPopup, $q, BudgetService, ExpenseService, AppSettings, $ionicLoading) {

    active();

    $scope.BudgetList = [];
    

    function refreshData() {
        var daystep = 24 * 60 * 60 * 1000;
        $scope.BudgetList = [];

        if ($scope.budget.type == 'monthly') {

            var startdt = $scope.startDateTime;
            var enddt = $scope.endDateTime;

            var from = new Date(startdt.getFullYear(), startdt.getMonth(), 1 + $scope.budget.monthlyStartDay - 1);

            while (enddt.getTime() >= from.getTime())
            {
                budgetEnd = new Date(from.getFullYear(), from.getMonth() + 1, $scope.budget.monthlyStartDay - 1);

                $scope.BudgetList.push({
                    start: from,
                    end: budgetEnd,
                    total: 0
                })

                from = new Date(budgetEnd.getTime() + daystep);
            }

            for (var i = 0; i < $scope.expenses.length; i++) {
                var transdatetick = $scope.expenses[i].transactionDateTime

                for (var j = 0; j < $scope.BudgetList.length; j++)
                {
                    var currBudget = $scope.BudgetList[j];
                    if (transdatetick >= currBudget.start.getTime() && transdatetick <= currBudget.end.getTime()) {
                        var expAmt = $scope.expenses[i].amount;
                        $scope.BudgetList[j].total += expAmt;
                        break;
                    }
                }
            }

        }

    }

    function active() {
        $scope.appsettings = AppSettings;

        var promises = [];
        $ionicLoading.show({ template: 'Loading...' });
        promises.push(ExpenseService.getFirstExpense().then(function (d) {
            $scope.startDateTime = new Date(d.transactionDateTime);
        }));

        promises.push(ExpenseService.getLastExpense().then(function (d) {
            $scope.endDateTime = new Date(d.transactionDateTime);
        }));

        promises.push(ExpenseService.getFirebaseExpenses().then(function (d) {
            $scope.expenses = d;
        }));

        promises.push(BudgetService.getFirebaseBudget().then(function (d) {
            $scope.budget = d;
        }));

        $q.all(promises).then(function () {
            refreshData();
            $ionicLoading.hide();
        });

    }

    $scope.refresh = function () {
        active();
    }
});