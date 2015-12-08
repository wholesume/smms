angular.module('smms.controllers', ['smms.calls.services'])

.controller('SmmsCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        //        $timeout(function () {
        //            $scope.closeLogin();
        //        }, 1000);
    };
})

.controller('CallsCtrl', function ($scope, CallService) {
    $scope.ctrlVars = {};
    $scope.ctrlVars.showLoadingIcon = true;
    $scope.calls = [];
    CallService.getCalls().success(function (data, status, headers, config) {

        $scope.calls = data;
        $scope.ctrlVars.showLoadingIcon = false;
    }).error(function (data, status, headers, config) {

        $scope.ctrlVars.showLoadingIcon = false;
        alert(headers);
    });
})

.controller('CallCtrl', function ($scope, $stateParams, CallService) {
    $scope.ctrlVars = {};
    $scope.ctrlVars.showLoadingIcon = true;
    $scope.call = {};
    CallService.getCall($stateParams).success(function (data, status, headers, config) {
        data.addedOn = new Date(data.addedOn).toDateString();
        data.nextPlannedCall = new Date(data.nextPlannedCall).toDateString();
        $scope.call = data;
        $scope.ctrlVars.showLoadingIcon = false;

    }).error(function (data, status, headers, config) {

        alert(headers);
        $scope.ctrlVars.showLoadingIcon = false;
    });

});