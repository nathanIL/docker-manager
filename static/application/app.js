angular.module('manager',['ngRoute','ngResource','manager.services','manager.navbar','manager.dashboard'])
 .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: "static/application/dashboard/dashboard.html",
        controller: 'dashboardCtrl'
      })
     .otherwise({ redirectTo: '/' });
 } ])
 .constant('APPLICATION_NAME','Docker Manager')
 .constant('APPLICATION_VERSION','v1.0.0')
 .constant('DOCKER_ENDPOINT','dockerapi')
 .constant('DOCKER_PORT','')
 .constant('DOCKER_API_VERSION','v1.19');