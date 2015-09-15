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
    });