/* Services */
var smmsCallService = angular.module('smms.calls.services', ['ngResource']);
var serviceUrl = "http://calls.uptitek.com/calls/api/"
    //var host = "calls.uptitek.com:port/calls/api/";
    //Add :port to the host url and include port in the ajax request if remote host uses port other than 80
    //var port = ":80"; // The port number of remote server(not required if port is stardard port 80) 
var service = "call/"; // The entry url to the remote application api
var clientKey = "59a94a0ac0f75200d1477d0f158a23d7feb08a2db16d21233b36fc8fda1a958c1be52b439f7957733bd65950cdfa7918b2f76a480ed01bb6e4edf4614eb8a708";
//Super user
var userKey = "e9f809e730f97cdbe4724e5bd6acc9b2165dcf7408bb3c733de534214e61f691a087eba7c674f1aa38cf5631a3c3c48e29194a3113b65756b0bbfdf98f7964a5";

//Admin user
//var userKey = "507b553b106b1b9963b7affb34e5ed14bc1160bbdea24c094405b306bdcb2520823a0c7db7da4b51cf45cbdbad519eeca9affd7103b131d1e65a4974ba56b18d"

//BomItem object RESTFull services
//wholesomeService.factory('BomItem', function ($resource) {
//    return $resource(host + app + 'bomItem', {
//        port: port
//    });
//});

smmsCallService.factory('CallService', function ($http) {

    return {
        getCalls: function () {
            return $http.get(serviceUrl + service + 'list/' + clientKey + '/' + userKey);
        },

        getCall: function ($stateParams) {
            return $http.get(serviceUrl + service + $stateParams.itemId + '/' + clientKey + '/' + userKey);
        }
    }
});

smmsCallService.factory('LoginService', function ($http) {
    return {
        getRole: function (user) {
            var config = {
                headers: {
                    'Content-Type': 'text/plain'
                },
                // Work-around to avoid the default transformation to json.
                // To remove it we have to change the return type from server to plain text.
                transformResponse: function(data, headers){
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