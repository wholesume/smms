/* Services */
var smmsCallService = angular.module('smms.calls.services', ['ngResource']);
var serviceUrl = "http://calls.uptitek.com:80/calls/api/"
    //var host = "calls.uptitek.com:port/calls/api/";
    //Add :port to the host url and include port in the ajax request if remote host uses port other than 80
    //var port = ":80"; // The port number of remote server(not required if port is stardard port 80) 
var service = "call/"; // The entry url to the remote application api
var clientKey = "59a94a0ac0f75200d1477d0f158a23d7feb08a2db16d21233b36fc8fda1a958c1be52b439f7957733bd65950cdfa7918b2f76a480ed01bb6e4edf4614eb8a708";
//Super user
var userKey = "5267768822ee624d48fce15ec5ca79cbd602cb7f4c2157a516556991f22ef8c7b5ef7b18d1ff41c59370efb0858651d44a936c11b7b144c48fe04df3c6a3e8da";

//Admin user
//var userKey = "507b553b106b1b9963b7affb34e5ed14bc1160bbdea24c094405b306bdcb2520823a0c7db7da4b51cf45cbdbad519eeca9affd7103b131d1e65a4974ba56b18d"

//BomItem object RESTFull services
//wholesomeService.factory('BomItem', function ($resource) {
//    return $resource(host + app + 'bomItem', {
//        port: port
//    });
//});

smmsCallService.factory('CallService', function ($http) {
    var calls = [];

    return {
        getCalls: function () {
            return $http.get(serviceUrl + service + 'list/' + clientKey + '/' + userKey);
        }
    }
});

//smmsCallService.factory('ListCalls', function ($resource) {
//    return $resource(host + app + service + '/list/' + clientKey + '/' + userKey, {
//        port: port
//    }); // Note the full endpoint address
//});