angular.module('manager.components.images',['ui.grid','ui.grid.resizeColumns']).
  controller('imagesCtrl',['$scope','Image','StartModal',
             function($scope,Image,StartModal) {

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
      $scope.openStartModalAction = function(id,name) {
                StartModal.run($scope,id,name);
      };
/*    $scope.openStartModalAction = function (id,name) {
       $scope.selectedImageNameModalAction = name;

        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'static/application/shared/modals/startModal.html',
          scope: $scope,
          size: 'lg',
        });

        $scope.isString = angular.isString; // utility

        *//* The following map is used to dynamically construct (with angular formly) the 'Parameters' modal tab.
           Remote Docker API: https://docs.docker.com/reference/api/docker_remote_api_v1.19/#create-a-container
        *//*
        //TODO: Complete this modal
        $scope.regularStartParameters = {};
        $scope.hostConfigParameters = {};
        $scope.startParameterFields = [ { key: 'Hostname',  type: 'hostname', templateOptions: { placeholder: 'development-srv-01' } },
                                        { key: 'Domainname',type: 'domain',   templateOptions: { placeholder: 'mycompany.com' } },
                                        { key: 'User',
                                          type: 'input',
                                          templateOptions: {
                                                type: 'text',
                                                label: 'User',
                                                description: 'User to use within the container',
                                                placeholder: 'e.g: joe' } },
                                        { key: 'Env',
                                          type: 'input',
                                          templateOptions: {
                                                type: 'text',
                                                label: 'Environment Variables',
                                                placeholder: 'e.g: A=1,B=2,...',
                                                description: 'Environment variables to be used within the container separated by comma. Should be set as follows: A=1,B=2,C=3' },
                                          parsers: [ function(d) { return d.split(/\s*,\s*//*) } ] },
                                        { key: 'Cmd',
                                          type: 'input',
                                          templateOptions: {
                                                type: 'text',
                                                label: 'Command line',
                                                placeholder: 'e.g: tail -f /dev/null',
                                                description: 'The shell command to run' },
                                          parsers: [ function(d) { return d.split(/\s+/) } ] },
*//*                                        { key: 'Memory',
                                          type: 'input',
                                          ngModelElAttrs: { 'min': '0' },
                                          templateOptions: {
                                                type: 'number',
                                                label: 'Memory limit (MB)',
                                                placeholder: 'e.g: 16',
                                                description: 'Set the container memory limit (in megabytes)' },
                                          parsers: [ function(d) { return d * 1048576 } ] },
                                        { key: 'MemorySwap',
                                          type: 'input',
                                          ngModelElAttrs: { 'min': '-1' },
                                          templateOptions: {
                                                type: 'number',
                                                label: 'Total memory limit (MB)',
                                                placeholder: 'e.g: 32',
                                                description: 'Set the total memory limit (memory + swap); set -1 to disable swap You must use this with memory and make the swap value larger than memory' },
                                          parsers: [ function(d) { return d * 1048576 } ] },*//*
                                        { key: 'AttachStdin',
                                          type: 'checkbox',
                                          defaultValue: false,
                                          templateOptions: { label: 'Attach standard input?',
                                                             description: 'Attach standard input (STDIN) from host to container'} },
                                        { key: 'AttachStdout',
                                          type: 'checkbox',
                                          defaultValue: true,
                                          templateOptions: { label: 'Attach standard output?',
                                                             description: 'Attach standard output (STDOUT) from container to host'} },
                                        { key: 'AttachStderr',
                                          type: 'checkbox',
                                          defaultValue: true,
                                          templateOptions: { label: 'Attach standard error?',
                                                             description: 'Attach standard error (STDERR) from container to host'} },
                                        { key: 'Tty',
                                          type: 'checkbox',
                                          defaultValue: false,
                                          templateOptions: { label: 'Attach standard streams to tty?',
                                                             description: 'Attach standard streams to a tty, including stdin if it is not closed'} },
                                        { key: 'OpenStdin',
                                          type: 'checkbox',
                                          defaultValue: false,
                                          templateOptions: { label: 'Open standard input?',
                                                             description: 'Open the standard input stream'} },
                                        { key: 'StdinOnce',
                                          type: 'checkbox',
                                          defaultValue: false,
                                          templateOptions: { label: 'Close standard input once?',
                                                             description: 'Close standard input after the 1 attached client disconnects'} } ];

//Memory
        $scope.HostConfigParameterFields = [];

        $scope.modalAbort = function() { modalInstance.dismiss('abort'); }
        $scope.modalRun = function() {
                var data = {};

                modalInstance.close('run');
                LoadingModal.show("Starting: <b>" + name + "</b>, please wait");
                // TODO: Merge both startParameterFields and HostConfigParameterFields and used the merged Map instead of regularStartParameters
                angular.forEach($scope.regularStartParameters, function(v,k) {
                        data[k] = v;
                  } );
                data.Image = id;
                var cs = new Container(data);
                // TODO: Possible a problem to solve with $q?
                // TODO: On errors, show the error message
                cs.$create(function(success_val,resp_headers) {
                        cs.$start({ id: success_val.Id },
                        function(sv,rh) { LoadingModal.hide() },
                        function(fv) { LoadingModal.hide() } );
                },function(error_val) { LoadingModal.hide() } );
         };
      };*/

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