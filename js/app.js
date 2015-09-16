'use strict';


// Declare app level module which depends on filters, and services
// TODO order modules A-Z
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'boardServices',
  'myApp.directives',
  'myApp.controllers',
  'common.authentication'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/home/_home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/:username', {templateUrl: 'partials/boards/_list.html', controller: 'BoardListCtrl'});
  $routeProvider.when('/:username/products', {templateUrl: 'partials/products/_list.html', controller: 'SortProductListCtrl'});

  $routeProvider.when('/:username/:board_slug', {templateUrl: 'partials/boards/_show.html', controller: 'BoardListCtrl'});

  $routeProvider.when('/:username/:board_slug/pins', {templateUrl: 'partials/pins/_list.html', controller: 'PinListCtrl'});
  $routeProvider.when('/:username/:board_slug/pins/:pin_id', {templateUrl: 'partials/pins/_show.html', controller: 'ProductListCtrl'});

  $routeProvider.when('/:username/:board_slug/pins/:pin_id/products', {templateUrl: 'partials/products/_list.html', controller: 'ProductListCtrl'});
  $routeProvider.otherwise({redirectTo: '/404-not-found'});
  //$locationProvider.html5Mode(true);
}]).
run(function($rootScope) {
  $rootScope.$on('$viewContentLoaded', function () {
    $(document).foundation();
  });
});
