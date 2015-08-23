angular.module('manager.components',[]).
  controller('imagesCtrl',['$scope','Image', function($scope,Image) {
    $scope.imagesGrid = {
                enableSorting: true,
                enableHiding: false,
                columnDefs: [ { field: 'name' },
                              { field: 'tag' },
                              { field: 'id' },
                              { field: 'created' },
                              { field: 'action' }]

                };
     Image.query( function(d) {
        $scope.imagesGrid.data = [];
        angular.forEach(d, function(v,k) {
                var date = new Date(0);
                date.setUTCSeconds(v['Created']);
                var formatted_date = date.getDate() + "/" + ( date.getMonth() + 1) + "/" + date.getFullYear();

                angular.forEach(v.RepoTags, function(vs,ks) {
                    var name = vs.split(':');
                    $scope.imagesGrid.data.push( { name: name[0],
                                                   tag: name[1],
                                                   id: v.Id.substring(0,12),
                                                   created: formatted_date } );
                });
        } );

     });
  } ]);