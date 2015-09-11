angular.module('manager.components',['ui.grid','ui.grid.resizeColumns']).
  controller('imagesCtrl',['$scope','$modal','Image','Container','LoadingModal',
             function($scope,$modal,Image,Container,LoadingModal) {

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

    $scope.removeImage = function() {};

    /* Opens the Container Run modal window
    *  Parameters:
    *  id: Docker image id (12 chars)
    */
    $scope.openStartModalAction = function (id,name) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'startModal.html',
          scope: $scope,
          size: 'lg',
        });

        $scope.isString = angular.isString; // utility

        /* The following map is used to dynamically construct the 'Parameters' modal tab.

           name: the Docker attribute name (According to the remote API).
           val: the input value provided by the user.
           tip: the tip to show to the user about this input.
           transform: a function to call on the provided input before we post it to the server / docker daemon.

           Remote Docker API: https://docs.docker.com/reference/api/docker_remote_api_v1.19/#create-a-container
        */
        $scope.startParameters = [ { name: 'Hostname', val: "", tip: "Leave blank for automatically generated hostname" },
                                   { name: 'Domainname', val: "", tip: "Leave blank for default domain name " },
                                   { name: 'Cmd', val: "", transform: function(d) { return d.split(/\s+/) } },
                                   { name: 'User', val: "", tip: "Leave blank to use default user" },
                                   { name: 'Env', val: "", tip: "A list of environment variables in the form of VAR=value separated with a comma",
                                                           transform: function(d) { return d.split(/\s*,\s*/) } },
                                   { name: 'AttachStdin', val: false },
                                   { name: 'AttachStdout', val: true },
                                   { name: 'AttachStderr', val: true },
                                   { name: 'Tty', val: false },
                                   { name: 'OpenStdin', val: false },
                                   { name: 'StdinOnce', val: false } ];


        $scope.modalAbort = function() { modalInstance.dismiss('abort'); }
        $scope.modalRun = function() {
                var data = {};

                modalInstance.close('run');
                LoadingModal.show("Starting: <b>" + name + "</b>, please wait");
                angular.forEach($scope.startParameters, function(v,k) {
                        if (angular.isString(v.val) && v.val.trim().length > 0) {
                            data[v.name] = v.hasOwnProperty('transform') ? v.transform(v.val.trim()) : v.val.trim();
                        }
                        data.Image = id;
                  } );

                var cs = new Container(data);
                // TODO: Possible a problem to solve with $q?
                // TODO: On errors, show the error message
                cs.$create(function(success_val,resp_headers) {
                        cs.$start({ id: success_val.Id },
                        function(sv,rh) { LoadingModal.hide() },
                        function(fv) { LoadingModal.hide() } );
                },function(error_val) { LoadingModal.hide() } );
         };
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