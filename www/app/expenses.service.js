angular.module('app')

.factory('ExpenseService', ['$rootScope', 'localStorageService', '$q', function ($rootScope, localStorageService, $q) {
    var initExpenseTypes = [
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

    var expenses = [];
    var expenseTypes = localStorageService.get('expense.types');
    var username = localStorageService.get('username');
    var ref = new Firebase("https://xzexpenses.firebaseio.com/" + username + "/expenses/");

    activate();

    function activate() {
        //expenses = localStorageService.get('ionic.expenses');        
        if (expenseTypes == null) {
            expenseTypes = initExpenseTypes;
        }

        ref.once('value', function (data) {
            expenses = [];

            data.forEach(function (d) {
                var exp = d.val();
                exp.datakey = d.key();
                //expenses.push(d.val());
                expenses.push(exp);
            });

            $rootScope.$emit('expense.change', expenses);
        });
    }

    var getFirebaseExpenses = function () {

        var deferred = $q.defer();
        usernameCheck = localStorageService.get('username');
        if (username != usernameCheck)
        {
            username = usernameCheck;
            ref = new Firebase("https://xzexpenses.firebaseio.com/" + username + "/expenses/");
        }

        ref.once('value', function (data) {
            expenses = [];
            data.forEach(function (d) {
                var exp = d.val();
                exp.datakey = d.key();

                //expenses.push(d.val());
                expenses.push(exp);
                });

                deferred.resolve(expenses);
            });

        return deferred.promise;
    }

    var getMaxId = function (exp) {
        var maxId = 0;
        for (var i=0; i< expenses.length; i++)
        {
            if (expenses[i].id > maxId) {
                maxId = expenses[i].id;
            }
        }

        return maxId + 1;
    }

    var getExpByIndex = function (index) {
        return expenses[index]
    };

    var getExpense = function (key) {
        var deferred = $q.defer();

        ref.child(key).once('value', function (data) {
            var exp = data.val();
            exp.datakey = data.key();

            deferred.resolve(exp);
        });

        return deferred.promise;
    }

    var getExpById = function (expId) {
        for (var i = 0; i < expenses.length; i++) {
            if (expenses[i].id === parseInt(expId)) {
                return todos[i];
            }
        }
        return null;
    };

    var addNew = function () {
        var newId = getMaxId(expenses);

        var newObject = {
            id: newId,
            type: "",
            title: "",
            place: "",
            amount: Number.NaN,
            transactionDate: new Date()
        };

        newObject.groupDate = moment(newObject.transactionDate).format('YYYY-MM-DD');
        return newObject;
    };

    var save = function (exp) {

        for (var i = 0; i < expenses.length; i++) {
            if (expenses[i].id == exp.id) {
                expenses[i] = exp;
                break;
            }
        }

        if (isNaN(exp.amount))
            exp.amount = 0;

        if (exp.datakey) {
            exp.transactionDateTime = exp.transactionDate.getTime();
            ref.child(exp.datakey).set(exp);
            $rootScope.$emit('expense.change', expenses);
        }
        else {
            expenses.push(exp);
            //localStorageService.set('ionic.expenses', expenses);
            exp.transactionDateTime = exp.transactionDate.getTime();
            ref.push(exp).once('value', function (data) {
                $rootScope.$emit('expense.change', expenses);
            });
        }
    };

    var deleteAll = function(){
        //localStorageService.remove('ionic.expenses');
        ref.remove();
        expenses = [];
        $rootScope.$emit('expense.change', expenses);
    }

    var deleteItem = function(datakey) {
        ref.child(datakey).remove();
        var pos = 0;
        for (var i = 0; i < expenses.length; i++) {
            if (expenses[i].datakey === datakey) {
                pos = i;
                break;
            }
        }
        expenses.splice(pos, 1);

        $rootScope.$emit('expense.change', expenses);

    }

    var getFirstExpense = function () {
        var deferred = $q.defer();
        var query = ref.orderByChild("transactionDateTime").limitToFirst(1);
        query.on("child_added", function (d) {
            // This will only be called for the last 100 messages
            deferred.resolve(d.val());
        });

        return deferred.promise;
    }
    
    var getLastExpense = function () {
        var deferred = $q.defer();
        var query = ref.orderByChild("transactionDateTime").limitToLast(1);
        query.on("child_added", function (d) {
            // This will only be called for the last 100 messages
            deferred.resolve(d.val());
        });

        return deferred.promise;
    }

    var getExpenseRange = function (from, to) {
        var deferred = $q.defer();
        var query = ref.orderByChild("transactionDateTime").startAt(from).endAt(to);
        query.on("child_added", function (d) {
            if (d.numChildren() == 2) {
                // Data is ordered by increasing height, so we want the first entry
                var result = [];
                d.forEach(function (item) {
                    result.push(item.val());
                    deferred.resolve(result);
                });
            } else {
                deferred.resolve(d.val());
            }            
        });

        return deferred.promise;
    }

    return {
        expenseTypes: expenseTypes,
        expenses: expenses,

        getExpByIndex: getExpByIndex,
        getExpById:getExpById,
        addNew: addNew,
        save: save,
        deleteAll: deleteAll,
        deleteItem: deleteItem,
        getFirebaseExpenses: getFirebaseExpenses,
        getExpense: getExpense,
        getFirstExpense: getFirstExpense,
        getLastExpense: getLastExpense,
        getExpenseRange: getExpenseRange,
    }

}])