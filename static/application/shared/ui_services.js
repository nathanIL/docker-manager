/*
 User interface related interactions services.
*/
angular.module('manager.services.ui', [])
       .factory('Popover', function() {
        'use strict';
        return { show: function(data) {
                   $(data['element']).webuiPopover({
                        title: data['title'],
                        content: data['content'],
                        animation: 'pop',
                        trigger: 'hover'
                   });
        } };
    })
    .factory('LoadingModal',function() {
            /* Loading Modal */
            'use strict';
            return { show: function(msg) { waitingDialog.show('<small>' + msg + '</small>',{ dialogSize: 'sm' }) },
                     hide: waitingDialog.hide  }
    })
    .factory('Alertbox', function() {
            /* swal from SweetAlert: http://t4t5.github.io/sweetalert/ */
            'use strict';
            return function(data) {
                     var base_data = { html: true,
                                       title: '<small>' + data.title + '</small>',
                                       confirmButtonText: 'Close' };
                     return {
                        warn: function(data) {
                                               angular.merge(data,
                                                            { confirmButtonColor: '#DD6B55',
                                                              type: 'warning' },
                                                            base_data);
                                               swal(data) },
                        info: function(data) {
                                               angular.merge(data,
                                                            { confirmButtonColor: '#AEDEF4',
                                                              type: 'info' },
                                                            base_data);
                                               swal(data) },

                     };
            }
    })
    /* A Factory to open the start modal. this is used in several places hence we need it as a service.
       This is a menu which contains all the needed attributes to start / run an image.
       It takes the controller scope object on which it runs.
    */
    .factory('StartModal', ['$modal','Container','LoadingModal','Alertbox',
     function($modal,Container,LoadingModal,Alertbox) {
            return {
                run: function(scope,id,name) {
                       scope.selectedImageNameModalAction = name;

                        var modalInstance = $modal.open({
                          animation: true,
                          templateUrl: 'static/application/shared/modals/startModal.html',
                          scope: scope,
                          size: 'lg',
                        });

                        scope.isString = angular.isString; // utility

                        /* The following map is used to dynamically construct (with angular formly) the 'Parameters' modal tab.
                           Remote Docker API: https://docs.docker.com/reference/api/docker_remote_api_v1.19/#create-a-container
                        */
                        //TODO: Complete this modal
                        scope.regularStartParameters = {};
                        scope.hostConfigParameters = {};
                        scope.startParameterFields = [ { key: 'Hostname',  type: 'hostname', templateOptions: { placeholder: 'development-srv-01' } },
                                                        { key: 'Domainname',type: 'domain',   templateOptions: { placeholder: 'mycompany.com' } },
                                                        { key: 'User',
                                                          type: 'input',
                                                          templateOptions: {
                                                                type: 'text',
                                                                label: 'User',
                                                                description: 'User to use within the container',
                                                                placeholder: 'root' } },
                                                        { key: 'Entrypoint',
                                                          type: 'input',
                                                          templateOptions: {
                                                                type: 'text',
                                                                label: 'Entrypoint script',
                                                                placeholder: '/bin/sh -c',
                                                                description: 'The very first command to run in the container upon start' },
                                                          parsers: [ function(d) { return d.split(/\s+/) } ] },
                                                        { key: 'Cmd',
                                                          type: 'input',
                                                          templateOptions: {
                                                                type: 'text',
                                                                label: 'Command line',
                                                                description: 'Arguments to Entrypoint' },
                                                          parsers: [ function(d) { return d.split(/\s+/) } ] },
                                                          { key: 'environment_variables_map',
                                                            type: 'mapType',
                                                            noFormControl: true,
                                                            templateOptions: {
                                                                label: 'Environment variables',
                                                                key_name: 'Variable name',
                                                                value_name: 'Variable value'                                                            }
                                                          },
                /*                                        { key: 'Memory',
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
                                                          parsers: [ function(d) { return d * 1048576 } ] },*/
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

                        scope.HostConfigParameterFields = [];

                        scope.modalAbort = function() { modalInstance.dismiss('abort'); }
                        scope.modalRun = function() {
                                var data = {};

                                modalInstance.close('run');
                                LoadingModal.show("Starting: <b>" + name + "</b>, please wait");
                                // TODO: Merge both startParameterFields and HostConfigParameterFields and used the merged Map instead of regularStartParameters
                                angular.forEach(scope.regularStartParameters, function(v,k) {
                                        data[k] = v;
                                  } );
                                data.Image = id;
                                var cs = new Container(data);
                                // TODO: Possible a problem to solve with $q?
                                // TODO: On errors, show the error message
                                cs.$create(function(success_val,resp_headers) {
                                        cs.$start({ id: success_val.Id },
                                        function(sv,rh) { LoadingModal.hide() },
                                        function(serr) { LoadingModal.hide(); Alertbox({ title:"Container created, but failed to start" }).warn({ text:serr.data }) } );
                                },function(cerr) { LoadingModal.hide(); Alertbox({ title:"Could not create container"}).warn({ text:cerr.data })  } );
                         };
              }
            };
    } ]);