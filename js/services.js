'use strict';

/* Services */

var base_url = 'http://localhost:3020/v1/';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');


var boardServices = angular.module('boardServices', ['ngResource', 'ngSanitize', 'angulartics', 'angulartics.google.analytics']);

boardServices.config(['$httpProvider',
  function ($httpProvider) {
      //$httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');



      //$httpProvider.defaults.useXDomain = true;
      //delete $httpProvider.defaults.headers.common['X-Requested-With']; //Fixes cross domain requests
  }]);

boardServices.factory('Board', ['$resource',
  function($resource){
    return $resource(base_url + 'users/:username/boards/:board_slug', {}, {
      query: {method:'GET', params:{username:'@username', board_slug:'@board_slug'}, isArray:true}
    });
  }]);

boardServices.factory('Pin', ['$resource',
  function($resource){
    return $resource(base_url + 'users/:username/boards/:board_slug/pins/:pin_id', {}, {
      query: {method:'GET', params:{username:'@username', board_slug:'@board_slug', pin_id:'@pin_id'}, isArray:true}
    });
  }]);

boardServices.factory('Product', ['$resource',
  function($resource){
    return $resource(base_url + 'users/:username/boards/:board_slug/pins/:pin_id/products', {}, {
      query: {method:'GET', params:{username:'@username', board_slug:'@board_slug', pin_id:'@pin_id'}, isArray:true}
    });
  }]);

boardServices.factory('User', ['$resource',
  function($resource){
    return $resource(base_url + 'users/sign_in', {}, {
      sign_in: {method:'POST', params:{ user:{ email:'@email', password:'@password' } }}
    });
  }]);

boardServices.factory('GlobalProduct', ['$resource',
  function($resource){
    return $resource(base_url + 'users/:username/products', {}, {
      query: {method:'GET', params:{username:'@username', order:'@order'}, isArray:true}
    });
  }]);
