angular.module('smms.controllers', ['smms.services'])

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
    $scope.isLogged = false;

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        if (SettingsService.getUserToken() == null) {
            $scope.login();
        } else {
            $scope.isLogged = true;
        }
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
        $scope.loginData = {};
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Open the login modal
    $scope.logout = function () {
        SettingsService.removeUserToken();
        SettingsService.removeUsername();
        $scope.isLogged = false;
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
                $scope.isLogged = true;
                SettingsService.setUserToken(data.password);
                SettingsService.setUsername(data.username);
                $scope.closeLogin();
                $scope.$broadcast('loggedIn');
            }).error(function (data, status, headers, config) {
                SettingsService.removeUserToken();
                SettingsService.removeUsername();
                $scope.isLogged = false;
                $scope.showAlert('Error getting user');
                console.log(data);
                console.log(headers);
                console.log(status);
            });
        }).error(function (data, status, headers, config) {
            SettingsService.removeUserToken();
            SettingsService.removeUsername();
            $scope.isLogged = false;
            $scope.showAlert('Error getting user role');
            console.log(data);
            console.log(headers);
            console.log(status);
        });
    };



})

.controller('CallListCtrl', function ($scope, CallService) {

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.url == "/calls") {
            $scope.ctrlVars.showLoadingIcon = true;
            $scope.doRefresh();
        }
    });

    $scope.$on('loggedIn', function () {
        $scope.ctrlVars.showLoadingIcon = true;
        $scope.doRefresh();
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

.controller('CallCtrl', function ($scope, $stateParams, CallService, $ionicPopup) {
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

    $scope.deleteCall = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete call',
            template: 'Are you sure you want to delete this call?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                CallService.deleteCall($scope.call, function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success!',
                        template: 'The call was successfuly deleted'
                    });
                    alertPopup.then(function (res) {
                        $ionicHistory.goBack();
                    });
                }, function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Failure!',
                        template: 'The call was not deleted'
                    });
                });
            }
        });

    }

})

.controller('CallAddCtrl', function ($scope, ContactPersonService, ProspectService, CallService, SettingsService, $ionicHistory, $ionicPopup) {

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.url == "/bomitem/add") {
            $scope.loadContacts();
            $scope.loadProspects();
        }
    });

    $scope.loadContacts = function () {
        ContactPersonService.getContacts().success(function (data, status, headers, config) {
            $scope.ctrlVars.persons = data;
        }).error(function (data, status, headers, config) {
            $scope.ctrlVars.errorList.push({
                message: "It wasn't possible to retrieve the contacts"
            });
        });
    }

    $scope.loadProspects = function () {
        ProspectService.getProspects().success(function (data, status, headers, config) {
            $scope.ctrlVars.prospects = data;
        }).error(function (data, status, headers, config) {
            $scope.ctrlVars.errorList.push({
                message: "It wasn't possible to retrieve the prospects"
            });
        });
    }

    $scope.showBackToMenu = function () {
        return !($ionicHistory.backView());
    }

    $scope.ctrlVars = {};
    $scope.ctrlVars.showDelete = false;

    $scope.loadContacts();
    $scope.loadProspects();

    $scope.call = {};

    $scope.saveCall = function () {
        $scope.call.addedOn = new Date();
        $scope.call.addedBy = SettingsService.getUsername();
        CallService.addCall($scope.call).success(function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Success!',
                template: 'The call was successfuly added'
            });
            alertPopup.then(function (res) {
                $scope.call = {};
            });
        }, function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Failure!',
                template: 'The call was not added'
            });
        });

    }
})

.controller('ProspectsListCtrl', function ($scope, ProspectService) {

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.url == "/prospects") {
            $scope.ctrlVars.showLoadingIcon = true;
            $scope.doRefresh();
        }
    });

    $scope.$on('loggedIn', function () {
        $scope.ctrlVars.showLoadingIcon = true;
        $scope.doRefresh();
    });

    $scope.items = {};
    $scope.ctrlVars = {};
    $scope.ctrlVars.showLoadingIcon = false;
    $scope.ctrlVars.errorList = [];

    $scope.doRefresh = function () {
        $scope.ctrlVars.errorList = [];

        ProspectService.getProspects().success(function (data, status, headers, config) {
            $scope.items = data;
            $scope.ctrlVars.showLoadingIcon = false;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.shownItems = [];
            currentStart = 0;
            $scope.addItems();
        }).error(function (data, status, headers, config) {
            $scope.shownItems = [];
            currentStart = 0;
            $scope.ctrlVars.errorList.push({
                message: "It wasn't possible to retrieve the prospects"
            });
            $scope.ctrlVars.showLoadingIcon = false;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.ctrlVars.showLoadingIcon = false;
        });
    };

    $scope.shownItems = [];
    var currentStart = 0;
    /* Add more itens to be displayed on the page */
    $scope.addItems = function () {
        var i;
        for (i = currentStart; i < currentStart + 20 && i < $scope.items.length; i++) {

            $scope.shownItems.push($scope.items[i]);
        }
        currentStart += i;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    /* End addItens */

    $scope.moreDataCanBeLoaded = function () {
        return $scope.items.length > currentStart;
    }

})

.controller('ContactPersonsListCtrl', function ($scope, ContactPersonService) {

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.url == "/contactPerson") {
            $scope.ctrlVars.showLoadingIcon = true;
            $scope.doRefresh();
        }
    });

    $scope.$on('loggedIn', function () {
        $scope.ctrlVars.showLoadingIcon = true;
        $scope.doRefresh();
    });

    $scope.items = {};
    $scope.ctrlVars = {};
    $scope.ctrlVars.showLoadingIcon = false;
    $scope.ctrlVars.errorList = [];

    $scope.doRefresh = function () {
        $scope.ctrlVars.errorList = [];

        ContactPersonService.getContacts().success(function (data, status, headers, config) {
            $scope.items = data;
            $scope.ctrlVars.showLoadingIcon = false;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.shownItems = [];
            currentStart = 0;
            $scope.addItems();
        }).error(function (data, status, headers, config) {
            $scope.shownItems = [];
            currentStart = 0;
            $scope.ctrlVars.errorList.push({
                message: "It wasn't possible to retrieve the contacts"
            });
            $scope.ctrlVars.showLoadingIcon = false;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.ctrlVars.showLoadingIcon = false;
        });
    };

    $scope.shownItems = [];
    var currentStart = 0;
    /* Add more itens to be displayed on the page */
    $scope.addItems = function () {
        var i;
        for (i = currentStart; i < currentStart + 20 && i < $scope.items.length; i++) {

            $scope.shownItems.push($scope.items[i]);
        }
        currentStart += i;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    /* End addItens */

    $scope.moreDataCanBeLoaded = function () {
        return $scope.items.length > currentStart;
    }

})