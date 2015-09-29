angular.module('manager.navbar',[])
  .controller('navbarCtrl',['$scope','$interval','APPLICATION_NAME','APPLICATION_VERSION','Events',
  function($scope,$interval,APPLICATION_NAME,APPLICATION_VERSION,Events) {
    var since = 0;
    var numOfEventsToShow = 15;

    $scope.appname = APPLICATION_NAME;
    $scope.appversion = APPLICATION_VERSION;
    $scope.templatetop = "static/application/navbar/navbar-top.html";
    $scope.templateside = "static/application/navbar/navbar-side.html";

    /* Events notifications */
    $scope.events = [];
    $scope.dateFormat = 'yyyy-MM-dd HH:mm:ss';
    $interval(function(){
         $scope.events.find(function(elem,idx,arr) {
                if (elem.time > since)
                    since = elem.time;
         } );
         Events.query({ since: since + 1 }, function(value) {
               angular.forEach(value, function(v,i) {
                   if ($scope.events.length >= numOfEventsToShow) {
                       $scope.events.shift();
                   }
                   $scope.events.push(v);
               } );
         } );

    }, 3000 );

  }]);