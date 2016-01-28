// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'smms.controllers'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('smms', {
        url: '/smms',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'SmmsCtrl'
    })

    .state('smms.calls', {
            url: '/calls',
            views: {
                'menuContent': {
                    templateUrl: 'templates/calls.html',
                    controller: 'CallListCtrl'
                }
            }
        })
        .state('smms.call/add', {
            url: "/call/add",
            views: {
                'menuContent': {
                    templateUrl: "templates/add-call.html",
                    controller: 'CallAddCtrl'
                }
            }
        })

    .state('smms.call', {
        url: '/call/:itemId',
        views: {
            'menuContent': {
                templateUrl: 'templates/call.html',
                controller: 'CallCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/smms/calls');
});