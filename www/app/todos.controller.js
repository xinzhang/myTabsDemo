
angular.module('app')


.factory('TodoService', function () {
    var todos = [
        { id: 0, title: "Take out the trash", done: true },
        { id: 1, title: "Do laundry", done: false },
        { id: 2, title: "Start cooking dinner", done: false }
    ]

    return {
        todos: todos,
        getTodoByIndex: function (index) {
            return todos[index]
        },
        get: function (todoId) {
            for (var i = 0; i < todos.length; i++) {
                if (todos[i].id === parseInt(todoId)) {
                    return todos[i];
                }
            }
            return null;
        },

        addNew: function() {
            var id = todos[todos.length - 1].id + 1;
            console.log(id);

            return {id: id, title:"", done: false}
        },

        save: function (todo){
            todos.push(todo);
        }
    }
})

.controller('TodosCtrl', function ($scope, TodoService) {
    $scope.todos = TodoService.todos
})

.controller('TodoDetailCtrl', function ($scope, $stateParams, TodoService) {
    $scope.todo = TodoService.get($stateParams.todoId);
})

.controller('TodoAddCtrl', function ($scope, TodoService, $ionicViewService, $state) {
    $scope.todo = TodoService.addNew();

    $scope.goBack = function () {
        console.log('Going back');

        // This will show you the history stuff.
        var history = $ionicViewService.getBackView();
        console.log(history);

        $ionicViewService.goToHistoryRoot("002");
    }

    $scope.save = function () {
        console.log($scope.todo.title);

        TodoService.save($scope.todo);
        $state.go('tab.todos');
        
    }
})

//.controller('TodoDetailCtrl', function ($scope, todo) {
//    $scope.todo = todo;
//})