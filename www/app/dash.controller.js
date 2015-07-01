
angular.module('app')


.controller('DashCtrl', function ($rootScope, $scope, $ionicPopup, $q, BudgetService, ExpenseService, AppSettings, $ionicLoading) {
   
    active();

    function refreshData() {
        var curr = new Date();
        var from, to;

        if ($scope.budget.type == 'weekly') {
            from = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
            to = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
        }
        
        if ($scope.budget.type == 'monthly') {
            if (curr.getDay() < $scope.budget.monthlyStartDay) {
                from = new Date(curr.getFullYear(), curr.getMonth() - 1, $scope.budget.monthlyStartDay);
                to = new Date(curr.getFullYear(), curr.getMonth(), $scope.budget.monthlyStartDay - 1);
            }
            else {
                from = new Date(curr.getFullYear(), curr.getMonth(), $scope.budget.monthlyStartDay);
                to = new Date(curr.getFullYear(), curr.getMonth() + 1, $scope.budget.monthlyStartDay - 1);
            }
        }

        $scope.from = moment(from).format('YYYY-MM-DD');
        $scope.to = moment(to).format('YYYY-MM-DD');

        var total = 0;
        for (var i = 0; i < $scope.expenses.length; i++) {
            var transdate = new Date($scope.expenses[i].transactionDateTime);

            if (transdate > from && transdate < to) {
                total += $scope.expenses[i].amount;
            }
        }

        $scope.totalSpent = total;
        $scope.budgetLeft = $scope.budget.amount - total;

        var timeDiff = Math.abs(curr.getTime() - to.getTime());
        $scope.daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        burnDownChart();       
    }

    function active() {
        $scope.appsettings = AppSettings;

        var promises = [];
        $ionicLoading.show({ template: 'Loading...' });
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

    $rootScope.$on('budget.change', function (event, data) {
        $scope.budget = data;
        active();
    });

    $rootScope.$on('expense.change', function (event, data) {
        $scope.expenses = data;
        active();
    });

    function pieChart() {
        $scope.pieChartConfig = {
            options: {
                chart: {
                    type: 'pie'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {y}',
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'budget/spending',
                data: [
                    ['spend', $scope.totalSpent],
                    ['left', $scope.budgetLeft]
                ]
            }],

            title: {
                text: 'budget/spending'
            },

            loading: false
        };
    }

    function stackedBarChart() {
        $scope.stackbarChartConfig = {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Stacked bar chart'
            },
            xAxis: {
                categories: ['Apples', ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total fruit consumption'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'John',
                data: [5]
            }, {
                name: 'Jane',
                data: [2]
            }]
        };
 
    }

    function burnDownChart() {

        var Days = [];
        var Target = [];
        var Spending = [];

        var curr = new Date();
        curr.setHours(0,0,0,0);

        var from, to;

        var daystep = 24 * 60 * 60 * 1000;

        if ($scope.budget.type == 'weekly') {
            from = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
            to = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));            
        }

        if ($scope.budget.type == 'monthly') {
            if (curr.getDay() < $scope.budget.monthlyStartDay) {
                from = new Date(curr.getFullYear(), curr.getMonth()-1, $scope.budget.monthlyStartDay);
                to = new Date(curr.getFullYear(), curr.getMonth(), $scope.budget.monthlyStartDay - 1);
            }
            else {
                from = new Date(curr.getFullYear(), curr.getMonth(), $scope.budget.monthlyStartDay);
                to = new Date(curr.getFullYear(), curr.getMonth() + 1, $scope.budget.monthlyStartDay - 1);
            }
        }

        var daysCount = Math.floor((to - from) / daystep);
        var startAmount = 0;
        var stepAmount = $scope.budget.amount / daysCount;

        for (var i=0; i<daysCount; i++)
        {            
            var theDay = new Date(from.getTime() + i * daystep);
            var theDayFormated = moment(theDay).format('DD');

            Days.push(theDayFormated);
            Target.push(parseFloat((startAmount + stepAmount * i).toFixed(2)));
            Spending.push(0);
        }
                
        for (var i = 0; i < $scope.expenses.length; i++) {            
            var transdatetick = $scope.expenses[i].transactionDateTime
            if (transdatetick >= from && transdatetick <= to) {
                var expAmt = $scope.expenses[i].amount;
                var idx = Math.floor ((transdatetick - from) / daystep);
                Spending[idx] += expAmt;
            }
        }

        while (Spending.length != 0 && Spending[Spending.length - 1] == 0)
        {
            Spending.pop();
        }

        for (var i = 1; i < Spending.length; i++) {
            Spending[i] = Spending[i - 1] + Spending[i];
        }
        
        $scope.burndownChartConfig = {
            
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Average Spend/Budget'
                },
                xAxis: {
                    categories: Days
                },
                yAxis: {
                    title: {
                        text: 'Amount ($)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'Target',
                    data: Target
                }, {
                    name: 'Spending',
                    data: Spending
                }]
            }
    }

})
