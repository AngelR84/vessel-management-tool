var APIurl = "/api/v1/";
var vesselServices = angular.module('vesselServices', ['ngResource']);

vesselServices.factory('Vessel', ['$resource',
  function($resource){
    return $resource(APIurl + 'vessel/:_id', {}, {
    	  'query':  {method:'GET', isArray:true},
    	  'get':    {method:'GET'},
    	  'update': {method:'POST'},
    	  'create': {method:'POST'},
    	  'remove': {method:'DELETE'}
    });
  }]);

