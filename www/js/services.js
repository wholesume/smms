/* Services */
var smmsService = angular.module('smms.services', ['ngResource']);
var serviceUrl = "http://calls.uptitek.com/calls/api/";
var clientKey = "59a94a0ac0f75200d1477d0f158a23d7feb08a2db16d21233b36fc8fda1a958c1be52b439f7957733bd65950cdfa7918b2f76a480ed01bb6e4edf4614eb8a708";
var userKey;

smmsService.factory('CallService', function ($http, SettingsService) {

    return {
        getCalls: function () {
            return $http.get(serviceUrl + 'call/list/' + clientKey + '/' + SettingsService.getUserToken());
        },

        getCall: function ($stateParams) {
            return $http.get(serviceUrl + 'call/' + $stateParams.itemId + '/' + clientKey + '/' + SettingsService.getUserToken());
        },

        addCall: function (call) {
            return $http.post(serviceUrl + 'call/add/' + clientKey + '/' + SettingsService.getUserToken(), call);
        },

        deleteCall: function (call) {
            return $http.post(serviceUrl + 'call/delete/' + clientKey + '/' + SettingsService.getUserToken(), call);
        }
    }
});

smmsService.factory('LoginService', function ($http) {
    return {
        getRole: function (user) {
            var config = {
                headers: {
                    'Content-Type': 'text/plain'
                },
                // Work-around to avoid the default transformation to json.
                // To remove it we have to change the return type from server to plain text.
                transformResponse: function (data, headers) {
                    return data;
                }
            };
            return $http.post(serviceUrl + 'users/userRole/' + clientKey, user, config);
        },

        getUser: function (user) {
            return $http.post(serviceUrl + 'users/auth/' + clientKey, user);
        }
    }
});

smmsService.factory('ContactPersonService', function ($http, SettingsService) {

    return {
        getContacts: function () {
            return $http.get(serviceUrl + 'contactPerson/list/' + clientKey + '/' + SettingsService.getUserToken());
        },

        getPerson: function ($stateParams) {
            return $http.get(serviceUrl + 'contactPerson/' + $stateParams.itemId + '/' + clientKey + '/' + SettingsService.getUserToken());
        }
    }
});

smmsService.factory('ProspectService', function ($http, SettingsService) {

    return {
        getProspects: function () {
            return $http.get(serviceUrl + 'prospect/list/' + clientKey + '/' + SettingsService.getUserToken());
        },

        getPerson: function ($stateParams) {
            return $http.get(serviceUrl + 'prospect/' + $stateParams.itemId + '/' + clientKey + '/' + SettingsService.getUserToken());
        }
    }
});

smmsService.factory('SettingsService', function () {

    function _retrieveValue(key) {
        var value = localStorage[key];
        if (value) {
            return value;
        }
        return null;
    }

    function _saveValue(key, value) {
        localStorage[key] = value;
    }

    return {
        getUserToken: function () {
            return _retrieveValue("userToken");
        },
        setUserToken: function (value) {
            return _saveValue("userToken", value);
        },
        setUsername: function (value) {
            return _saveValue("username", value);
        },
        getUsername: function (value) {
            return _retrieveValue("username");
        },

        get: _retrieveValue,
        set: _saveValue,
    }
});