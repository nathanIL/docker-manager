angular.module('manager.components',[]).
  controller('imagesCtrl',['$scope','Image', function($scope,Image) {
    $scope.imagesGrid = {
                enableSorting: true,
                enableHiding: false,
                columnDefs: [
                  { field: 'name' },
                  { field: 'id' },
                  { field: 'created' }
                ],
//                onRegisterApi: function( gridApi ) {
//                  $scope.grid1Api = gridApi;
//                }
              };
     Image.query( function(d) {
        $scope.imagesGrid.data = [];
        angular.forEach(d, function(v,k) {
                console.log(v);
                $scope.imagesGrid.data.push( { name: v.RepoTags.join(','),
                                               id: v.Id.substring(0,12),
                                               created: 'april' } );

        } );
        //[{ name: 'Job', id: 'xxxxx', created: 'april'}];


     });
  } ]);