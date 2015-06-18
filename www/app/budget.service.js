angular.module('app')

.factory('BudgetService', ['$rootScope', 'localStorageService', '$q', function ($rootScope, localStorageService, $q) {
    
    var budget;

    var username = localStorageService.get('username');
    var ref = new Firebase("https://xzexpenses.firebaseio.com/" + username + "/budget/");

    activate();

    function activate() {
        //budget = localStorageService.get('ionic.budget');
    }

    var getFirebaseBudget = function () {
        var deferred = $q.defer();

        ref.once('value', function (data) {
            budget = data.val();

            if (!budget) {
                budget = {
                    type: 'weekly',
                    monthlyStartDay: Number.NaN,
                    amount: Number.NaN
                }
            }
            
            deferred.resolve(budget);
        });

        return deferred.promise;
    }

    var save = function (b) {
        budget = b;
        //localStorageService.set('ionic.budget', budget);

        ref.set(b);
        $rootScope.$emit('budget.change', budget);
    };

    return {        
        budget: budget,
        save: save,
        getFirebaseBudget: getFirebaseBudget,
    }

}])