angular.module('manager.components',['ui.grid','ui.grid.resizeColumns']).
  controller('imagesCtrl',['$scope','Image','Container', function($scope,Image,Container) {

    $scope.startAction = Container.start;
    $scope.imagesGrid = {
                enableSorting: true,
                enableHiding: false,
                enableColumnResizing: true,
                columnDefs: [ { field: 'name' },
                              { field: 'tag' },
                              { field: 'id' },
                              { field: 'created' },
                              { field: 'action',
                               cellTemplate: '<button ng-click="grid.appScope.startAction({ id: row.entity.id })">Run</button>'} ]

                };
     Image.query( function(d) {
        $scope.imagesGrid.data = [];
        angular.forEach(d, function(v,k) {
                var date = new Date(0);
                date.setUTCSeconds(v['Created']);
                var formatted_date = date.getDate() + "/" + ( date.getMonth() + 1) + "/" + date.getFullYear();

                angular.forEach(v.RepoTags, function(vs,ks) {
                    var parts = vs.split(':');
                    var tag = parts.pop()
                    var name = parts.join(':');

                    $scope.imagesGrid.data.push( { name: name,
                                                   tag: tag,
                                                   id: v.Id.substring(0,12),
                                                   created: formatted_date } );
                });
        } );

     });
  } ]);