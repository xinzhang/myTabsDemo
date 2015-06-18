/// <reference path="tab-todoAdd.html" />
/// <reference path="tab-todoAdd.html" />
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'angular.filter', 'ui.bootstrap.datetimepicker', 'LocalStorageModule', 'firebase', 'highcharts-ng', 'ngCordova'])// , 'ngCordova'])

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('introduction', {
            url: '/introduction',
            templateUrl: 'app/introduction.html',
            controller: 'IntroductionCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'app/login.html',
            controller: 'LoginCtrl'
        })

        .state('register', {
            url: '/register',
            templateUrl: 'app/register.html',
            controller: 'RegisterCtrl'
        })

      .state('tab', {
          url: "/tab",
          abstract: true,
          templateUrl: "app/tabs.html"
      })

    // Each tab has its own nav history stack:
    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'app/tab-dash.html',
                controller: 'DashCtrl'                
            }
        }
    })
      .state('tab.todos', {
          url: '/todos',
          views: {
              'tab-todos': {
                  templateUrl: 'app/tab-todos.html',
                  controller: 'TodosCtrl'
              }
          }
      })

          .state('tab.todosdetail', {
              url: '/todos/:todoId',
              views: {
                  'tab-todos': {
                      templateUrl: 'app/tab-todoDetail.html',
                      controller: 'TodoDetailCtrl',
                  }
              }
          })

        .state('tab.todosadd', {
            url: '/todosadd',
            views: {
                'tab-todos': {
                    templateUrl: 'app/tab-todoAdd.html',
                    controller: 'TodoAddCtrl'
                }
            }
        })

         .state('tab.expenses', {
             url: '/expenses',
             views: {
                 'tab-expenses': {
                     templateUrl: 'app/tab-expenses.html',
                     controller: 'ExpensesCtrl'
                 }
             }
         })

        .state('tab.expensesadd', {
            url: '/expensesadd/:expensekey',
            views: {
                'tab-expenses': {
                    templateUrl: 'app/tab-expenseAdd.html',
                    controller: 'ExpenseAddCtrl'
                }
            }
        })
.state('tab.expensesdetail', {
            url: '/expensesdetail/:expensekey',
            views: {
                'tab-expenses': {
                    templateUrl: 'app/tab-expenseDetail.html',
                    controller: 'ExpenseDetailCtrl'
                }
            }
        })
         .state('tab.budget', {
             url: '/budget',
             views: {
                 'tab-budget': {
                     templateUrl: 'app/tab-budget.html',
                     controller: 'BudgetCtrl'
                 }
             }
         })

        .state('tab.budgetAdd', {
            url: '/budgetAdd',
            views: {
                'tab-budget': {
                    templateUrl: 'app/tab-budgetAdd.html',
                    controller: 'BudgetAddCtrl'
                }
            }
        })

     .state('tab.history', {
         url: '/history',
         views: {
             'tab-history': {
                 templateUrl: 'app/tab-history.html',
                 controller: 'HistoryCtrl'
             }
         }
     })


      .state('tab.settings', {
          url: '/settings',
          views: {
              'tab-settings': {
                  templateUrl: 'app/tab-settings.html',
                  controller: 'AppSettingsCtrl'
              }
          }
      })

    .state('tab.settings-account', {
        url: '/settings-account',
        views: {
            'tab-settings': {
                templateUrl: 'app/tab-settings-account.html',
                controller: 'AccountSettingsCtrl'
            }
        }
    })

    .state('tab.settings-expensetypes', {
        url: '/settings-expensetypes',
        views: {
            'tab-settings': {
                templateUrl: 'app/tab-settings-expensetypes.html',
                controller: 'ExpenseTypesSettingsCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/introduction');

})

.run(function ($ionicPlatform, $state, localStorageService) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        var username = localStorageService.get('username');

        if (username != undefined) {
            $state.go('tab.dash');
        }
        else {
            $state.go('introduction');
        }
    });

})
