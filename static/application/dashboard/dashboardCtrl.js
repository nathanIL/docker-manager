angular.module('manager.components.dashboard',[])
  .controller('dashboardCtrl',['$scope','Image','Container','System','Popover','ContainerStatus','LoadingModal','Alertbox',
  function($scope,Image,Container,System,Popover,ContainerStatus,LoadingModal,Alertbox) {

    /* Populate the Images creation trend chart */
    Image.query(function(d) {
        var images_chart_data = [];
        var aggregator = new Map();

        angular.forEach(d, function(v,k) {
            d = new Date(0);
            d.setUTCSeconds(v['Created']);
            formatted = d.getDate() + "/" + ( d.getMonth() + 1) + "/" + d.getFullYear();
            aggregator[formatted] = aggregator[formatted] + 1 || 1;
        });
        for (var k in aggregator) {
            images_chart_data.push({ time: k, images: aggregator[k] });
        }
        Morris.Bar({ element: 'ImagesCreationTrendChart',
                      data: images_chart_data,
                      xkey: 'time',
                      ykeys: ['images'],
                      labels: ['Images'],
                      hideHover: 'always',
                      stacked: true });
    });
    /* End of Images creation trend bar population */

    /* Operating system related bars */
    System.get(function(d) {
            var parsed = new Map();

            //console.log( JSON.stringify(d) );
            /* Storage */
            d['DriverStatus'].find(function(e) {
                switch(e[0]) {
                    case "Data Space Total":
                        parsed["Data Space Total"] =  e[1].split(/\s+/);
                        break;
                    case "Data Space Used":
                        parsed["Data Space Used"] = e[1].split(/\s+/);
                        break;
                    case "Metadata Space Used":
                        parsed["Metadata Space Used"] = e[1].split(/\s+/);
                        break;
                    case "Metadata Space Total":
                        parsed["Metadata Space Total"] = e[1].split(/\s+/);
                        break;
                }
            });
            Morris.Donut({
                  element: 'StorageBar',
                  formatter: function (y, data) { return y[0] + ' ' + y[1] },
                  data: [{ label: 'Total', value: parsed["Data Space Total"] },
                         { label: 'Used', value: parsed["Data Space Used"] }]
            });
            Morris.Donut({
                  element: 'MetadataStorageBar',
                  formatter: function (y, data) { return y[0] + ' ' + y[1] },
                  data: [{ label: 'Total', value: parsed["Metadata Space Total"] },
                         { label: 'Used', value: parsed["Metadata Space Used"] }]
            });
    });
    /* End of Operating system related bars */

    /* Containers chart and table */
    $scope.containers = [];
    function updateContainers() {

        Container.query({all: 1}, function(d) {
            var datamap = {};
            var data = [];

            $scope.containers = [];
            d.forEach(function(element,index,array){
                var status = ContainerStatus.get(element);
                element['actions'] = status.actions;
                $scope.containers.push(element);
                datamap[status.status] = datamap[status.status] + 1 || 1;
            });

            angular.forEach(datamap, function(v,k) {
                   data.push({ label: k, value: v });
            } );
            var chartNode = document.getElementById("ContainersChart");
            while (chartNode.firstChild) {
                chartNode.removeChild(chartNode.firstChild);
            }
            Morris.Donut({
                  element: 'ContainersChart',
                  data: data
            });
        });
     }


    $scope.action = function(cid,action) {
             LoadingModal.show(action + " In progress, please wait");
             Container[action.toLowerCase()]({ id: cid },
                        function(val,rsph) { LoadingModal.hide();
                                             updateContainers(); },

                        function(resp) { LoadingModal.hide();
                                         Alertbox({ title: "Could not perform operation (Code " + resp.status +")" }).warn({ text: resp.statusText });
                                         updateContainers(); });
    };
    updateContainers();
    /* End of Containers chart and table */

    /* Popovers
     * TODO: I guess we can save these strings in a centralize location so i18n later will be easier to implement
    */
    Popover.show({ element: '#ImagesCreationTrendChartPopOver',
                    title: 'Images creation trend bar',
                    content: 'This bar shows the images creation trend. The dates reflect the image ' +
                             'creation date and not the pull date.<br/><br/>' +
                             '<b>Image:</b> A Docker image is a read-only template. For example, an image could contain an Ubuntu operating system with Apache and your web application installed. Images are used to create Docker containers. Docker provides a simple way to build new images or update existing images, or you can download Docker images that other people have already created. Docker images are the build component of Docker.'});

    Popover.show({ element: '#ContainersChartPopOver',
                   title: 'Containers status graph',
                   content: 'This graph shows the status of the current active containers.<br/></br>' +
                            '<b>Containers:</b> Docker containers are similar to a directory. A Docker container holds everything that is needed for an application to run. Each container is created from a Docker image. Docker containers can be run, started, stopped, moved, and deleted. Each container is an isolated and secure application platform. Docker containers are the run component of Docker.' });

    Popover.show({ element: '#ContainersListPopOver',
                    title: 'Containers list table',
                    content: "This table lists the currently available containers and the available actions depending on the container's status. <br/><br/>" +
                             '<b>Actions</b>:<br/>' +
                             '<ul>' +
                             '<li><u>Stop</u>: Stop a running container by sending SIGTERM and then SIGKILL after a grace period</li>' +
                             '<li><u>Kill</u>: Kill a running container using SIGKILL (Specific signals can be used on the <i>Containers</i> section)</li>' +
                             '<li><u>Pause</u>: Pause all processes within a container</li>' +
                             '<li><u>Unpause</u>: Unpause all processes within a paused container</li>' +
                             '<li><u>Remove</u>: Remove the container and all of its volumes</li>' +
                             '</ul>'});

    Popover.show({ element: '#StorageBarPopOver',
                    title: 'Operating system storage bar',
                    content: 'This bar shows the allotted amount of storage available for the docker\'s daemon storage driver'});

    Popover.show({ element: '#MetadataStorageBarPopOver',
                    title: 'Docker\'s Metadata storage bar',
                    content: 'This bar shows the allotted amount of metadata storage available for the docker\'s daemon storage driver'});

  }]);