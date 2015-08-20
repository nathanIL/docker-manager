angular.module('manager.navbar',[])
  .controller('navbarCtrl',['$scope','APPLICATION_NAME','APPLICATION_VERSION', function($scope,APPLICATION_NAME,APPLICATION_VERSION) {
    $scope.appname = APPLICATION_NAME;
    $scope.appversion = APPLICATION_VERSION;
    $scope.templatetop = "static/application/navbar/navbar-top.html";
    $scope.templateside = "static/application/navbar/navbar-side.html";

  }]);