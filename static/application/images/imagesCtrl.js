angular.module('manager.components.images',['ui.grid','ui.grid.resizeColumns']).
  controller('imagesCtrl',['$scope','$modal', 'Image','StartModal',
             function($scope,$modal,Image,StartModal) {

    $scope.imagesGrid = {
                columnDefs: [ { field: 'name',    enableHiding: false, enableSorting: true },
                              { field: 'tag',     enableHiding: false, enableSorting: true },
                              { field: 'id',      enableHiding: false, enableSorting: false },
                              { field: 'created', enableHiding: false, enableSorting: true },
                              { field: 'action',
                                enableHiding: false,
                                enableSorting: false,
                                cellTemplate: 'actionButtonGroup.html' } ]

    };
    $scope.openInfoModal = function(id, name) {
       /* Opens the Image Information modal window.
		*  Parameters:
		*  id: Docker image id (12 chars)
		*  name: image name
		*/
		// TODO: Get the image info, process it using json-human, and present on the modal.
		var modalInstance = $modal.open({
                          animation: true,
                          template: 'imageInfo.html',
                          scope: $scope,
                          size: 'lg',
                        });
    };
    $scope.removeImage = function() {};
    $scope.openStartModalAction = function(id, name) {
       /* Opens the Container Run modal window.
		*  Parameters:
		*  id: Docker image id (12 chars)
		*  name: image name
		*/
		StartModal.run($scope, id, name);
    };

     Image.query( function(d) {
        $scope.imagesGrid.data = [];
        angular.forEach(d, function(v, k) {
                var date = new Date(0);
                date.setUTCSeconds(v['Created']);
                var formatted_date = date.getDate() + "/" + ( date.getMonth() + 1) + "/" + date.getFullYear();

                angular.forEach(v.RepoTags, function(vs, ks) {
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