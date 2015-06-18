
angular.module('app')


.controller('IntroductionCtrl', function ($scope, $state, $ionicPopup, localStorageService) {

})

.controller('LoginCtrl', function ($scope, AccountService, $ionicPopup, $state, localStorageService) {
    $scope.data = {};

    $scope.userlogin = function () {
        AccountService.loginUser($scope.data.username, $scope.data.password)
            .success(function (data) {
            localStorageService.set('username', $scope.data.username);
            $state.go('tab.dash');
            }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            });
    }
})

.controller('RegisterCtrl', function ($scope, AccountService, $ionicPopup, $state, localStorageService) {
    $scope.data = {};

    $scope.register = function (isValid) {
        if (!isValid)
            return;

        AccountService.register($scope.data.username, $scope.data.password).success(function (data) {            
            localStorageService.set('username', $scope.data.username);
            $state.go('tab.dash');
        }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

