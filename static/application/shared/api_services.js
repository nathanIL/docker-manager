angular.module('manager.services.api', ['ngResource'])
    .factory('Events',function($resource,Settings) {
      'use strict';
      // A raw interface to the polling version of the docker events API.
      return $resource(Settings.url + '/events', { since: 0, until: function() { return Math.floor((new Date()).getTime() / 1000) } },
      { query: {method: 'GET', transformResponse:
             function(data, headersGetter) {
                  var array = [];
                  angular.forEach(data.split("\n"), function(d,i) {
                    var json = null;
                    try {
                        json = angular.fromJson(d);
                        array.push(json);
                    } catch (err) {
                        // Skip
                    }
                  });
              return array
             }, isArray: true } } )
    })
    .factory('Container', function ($resource, Settings) {
        'use strict';
        // Resource for interacting with the docker containers
        return $resource(Settings.url + '/containers/:id/:action', {
            name: '@name'
        }, {
            query: {method: 'GET', params: {all: 0, action: 'json'}, isArray: true},
            get: {method: 'GET', params: {action: 'json'}},
            start: {method: 'POST', params: {id: '@id', action: 'start'}, responseType: "text", isArray: false },
            stop: {method: 'POST', params: {id: '@id', t: 5, action: 'stop'}},
            restart: {method: 'POST', params: {id: '@id', t: 5, action: 'restart'}},
            kill: {method: 'POST', params: {id: '@id', action: 'kill'}},
            pause: {method: 'POST', params: {id: '@id', action: 'pause'}},
            unpause: {method: 'POST', params: {id: '@id', action: 'unpause'}},
            changes: {method: 'GET', params: {action: 'changes'}, isArray: true},
            create: {method: 'POST', params: {action: 'create'}},
            remove: {method: 'DELETE', params: {id: '@id', v: 0}},
            rename: {method: 'POST', params: {id: '@id', action: 'rename'}, isArray: false}
        });
    })
    .factory('ContainerCommit', function ($resource, $http, Settings) {
        'use strict';
        return {
            commit: function (params, callback) {
                   $http({
                       method: 'POST',
                       url: Settings.url + '/commit',
                       params: {
                           'container': params.id,
                           'repo': params.repo
                       }
                   }).success(callback).error(function (data, status, headers, config) {
                       console.log(error, data);
                   });
            }
        };
    })
    .factory('ContainerLogs', function ($resource, $http, Settings) {
        'use strict';
        return {
            get: function (id, params, callback) {
                $http({
                    method: 'GET',
                    url: Settings.url + '/containers/' + id + '/logs',
                    params: {
                        'stdout': params.stdout || 0,
                        'stderr': params.stderr || 0,
                        'timestamps': params.timestamps || 0,
                        'tail': params.tail || 'all'
                    }
                }).success(callback).error(function (data, status, headers, config) {
                    console.log(error, data);
                });
            }
        };
    })
    .factory('ContainerTop', function ($http, Settings) {
        'use strict';
        return {
            get: function (id, params, callback, errorCallback) {
                $http({
                    method: 'GET',
                    url: Settings.url + '/containers/' + id + '/top',
                    params: {
                        ps_args: params.ps_args
                    }
                }).success(callback);
            }
        };
    })
    .factory('Image', function ($resource, Settings) {
        'use strict';
        // Resource for docker images
        return $resource(Settings.url + '/images/:id/:action', {}, {
            query: {method: 'GET', params: {all: 0, action: 'json'}, isArray: true},
            get: {method: 'GET', params: {action: 'json'}},
            search: {method: 'GET', params: {action: 'search'}},
            history: {method: 'GET', params: {action: 'history'}, isArray: true},
            create: {method: 'POST', params: {action: 'create'}},
            insert: {method: 'POST', params: {id: '@id', action: 'insert'}},
            push: {method: 'POST', params: {id: '@id', action: 'push'}},
            tag: {method: 'POST', params: {id: '@id', action: 'tag', force: 0, repo: '@repo'}},
            remove: {method: 'DELETE', params: {id: '@id'}, isArray: true}
        });
    })
    .factory('Info', function ($resource, Settings) {
        'use strict';
        // Information for docker
        return $resource(Settings.url + '/version', {}, {
            get: {method: 'GET'}
        });
    })
    .factory('Auth', function ($resource, Settings) {
        'use strict';
        // Auto Information for docker
        return $resource(Settings.url + '/auth', {}, {
            get: {method: 'GET'},
            update: {method: 'POST'}
        });
    })
    .factory('System', function ($resource, Settings) {
        'use strict';
        // System for docker
        return $resource(Settings.url + '/info', {}, {
            get: {method: 'GET'}
        });
    })
    .factory('Settings', function (DOCKER_ENDPOINT, DOCKER_PORT, DOCKER_API_VERSION) {
        'use strict';
        var url = DOCKER_ENDPOINT;
        if (DOCKER_PORT) {
            url = url + DOCKER_PORT + '\\' + DOCKER_PORT;
        }
        return {
            displayAll: false,
            endpoint: DOCKER_ENDPOINT,
            version: DOCKER_API_VERSION,
            rawUrl: DOCKER_ENDPOINT + DOCKER_PORT + '/' + DOCKER_API_VERSION,
            url: url
         };
    })
    .factory('Dockerfile', function (Settings) {
        'use strict';
        var url = Settings.rawUrl + '/build';
        return {
            build: function (file, callback) {
                var data = new FormData();
                var dockerfile = new Blob([file], {type: 'text/text'});
                data.append('Dockerfile', dockerfile);

                var request = new XMLHttpRequest();
                request.onload = callback;
                request.open('POST', url);
                request.send(data);
            }
        };
    })
    .factory('ContainerStatus', function() {
        'use strict';
        /* Based on Docker's element Status, returns an object holding:
            1. Time since container has started
            2. The status string (Exited, Running, Paused)
            3. Next available options (e.g: If Paused ==> Unpause. Started ==> Stop,Pause,Kill,...).
        */
        return { get: function(d) {
                var UpStatusRegex = /^Up(.+?)(?:\((.+?)\))?$/;
                var ExitedStatusRegex = /^Exited\s+\(\w+\)(.+)$/;
                var match = [];
                var res = { status: 'Created', actions: ['Remove','Start'] };

                 if (match = UpStatusRegex.exec(d.Status)) {
                    res = { time: match[1].trim(),
                            status: match[2] || 'Running',
                            actions: match[2] == 'Paused' ? ['Unpause'] : ['Stop','Kill','Pause'] };

                 } else if (match = ExitedStatusRegex.exec(d.Status)) {
                    res = { time: match[1].trim(),
                            status: 'Exited',
                            actions: ['Remove']};
                 }
                return res;
        } };
    });