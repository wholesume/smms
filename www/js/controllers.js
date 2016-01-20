angular.module('smms.controllers', ['smms.calls.services'])

.controller('SmmsCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, LoginService, SettingsService) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    // An alert dialog
    $scope.showAlert = function (title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });

        alertPopup.then(function (res) {});
    };

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        if (SettingsService.getUserToken() == null) {
            $scope.login();
        };
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
        user = {};
        user.username = $scope.loginData.username;
        var shaObj = new jsSHA("SHA-512", "TEXT");
        shaObj.update($scope.loginData.password);
        var hash = shaObj.getHash("HEX");
        user.password = hash;
        LoginService.getRole(user.username).success(function (data, status, headers, config) {
            user.groups = [{
                usergroup: data
            }];
            LoginService.getUser(user).success(function (data, status, headers, config) {
                $scope.showAlert('Logged-in succesfully!');
                SettingsService.setUserToken(data.password);
                $scope.closeLogin();
            }).error(function (data, status, headers, config) {
                $scope.showAlert('Error getting user');
                console.log(data);
                console.log(headers);
                console.log(status);
            });
        }).error(function (data, status, headers, config) {
            $scope.showAlert('Error getting user role');
            console.log(data);
            console.log(headers);
            console.log(status);
        });
    };



})

.controller('CallsCtrl', function ($scope, CallService) {

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.url == "/calls") {
            $scope.ctrlVars.showLoadingIcon = true;
            $scope.doRefresh();
        }
    });
    $scope.calls = {};
    $scope.ctrlVars = {};
    $scope.ctrlVars.showLoadingIcon = false;
    $scope.ctrlVars.errorList = [];

    $scope.doRefresh = function () {
        $scope.ctrlVars.errorList = [];

        CallService.getCalls().success(function (data, status, headers, config) {
            $scope.calls = data;
            $scope.ctrlVars.showLoadingIcon = false;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.shownCalls = [];
            currentStart = 0;
            $scope.addItems();
        }).error(function (data, status, headers, config) {
            $scope.shownCalls = [];
            currentStart = 0;
            $scope.ctrlVars.errorList.push({
                message: "It wasn't possible to retrieve the calls"
            });
            $scope.ctrlVars.showLoadingIcon = false;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.ctrlVars.showLoadingIcon = false;
        });
    };

    $scope.shownCalls = [];
    var currentStart = 0;
    /* Add more itens to be displayed on the page */
    $scope.addItems = function () {
        var i;
        for (i = currentStart; i < currentStart + 20 && i < $scope.calls.length; i++) {

            $scope.shownCalls.push($scope.calls[i]);
        }
        currentStart += i;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    /* End addItens */

    $scope.moreDataCanBeLoaded = function () {
        return $scope.calls.length > currentStart;
    }

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