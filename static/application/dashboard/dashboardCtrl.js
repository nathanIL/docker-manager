angular.module('manager.dashboard',[])
  .controller('dashboardCtrl',['$scope','Image','Container','Popover','ContainerStatus', function($scope,Image,Container,Popover,ContainerStatus) {

    /* Populate the Images creation trend chart */
    Image.query(function(d) {
        var images_chart_data = [];
        var aggregator = new Map();

        angular.forEach(d, function(v,k) {
            d = new Date(0);
            d.setUTCSeconds(v['Created']);
            formatted = d.getDate() + "/" + ( d.getMonth() + 1) + "/" + d.getFullYear();
            if (formatted in aggregator) {
              aggregator[formatted] += 1;
            } else {
              aggregator[formatted] = 1;
            }
        });
        for (var k in aggregator) {
            images_chart_data.push({ time: k, images: aggregator[k] });
        }
        new Morris.Line({
            element: 'ImagesCreationTrendChart',
            data: images_chart_data,
            xkey: 'time',
            ykeys: ['images'],
            labels: ['Images'],
            parseTime: false
        });
    });
    // TODO: Can we move these strings to a template?
    Popover.show({ element: '#ImagesCreationTrendChartPopOver',
                    title: 'Images creation trend graph',
                    content: 'This graph shows the images creation trend. The dates reflect the image ' +
                             'creation date and not the pull date.<br/><br/>' +
                             '<b>Image:</b> A Docker image is a read-only template. For example, an image could contain an Ubuntu operating system with Apache and your web application installed. Images are used to create Docker containers. Docker provides a simple way to build new images or update existing images, or you can download Docker images that other people have already created. Docker images are the build component of Docker.'});

     /* End of Images creation trend chart population */


    /* Containers chart */
    Container.query( function(d) {
        var datamap = {};
        var data = [];

        d.forEach(function(element,index,array){
            var status = ContainerStatus.get(element);
            if (status.status in datamap) {
                datamap[status.status] += 1;
            } else {
                datamap[status.status] = 1;
            }
        });
        angular.forEach(datamap, function(v,k) {
                console.log(v);
               data.push({ label: k, value: v });
        } );
        new Morris.Donut({
              element: 'ContainersChart',
              data: data
        });

    });

    Popover.show({ element: '#ContainersChartPopOver',
                   title: 'Containers status graph',
                   content: 'This graph shows the status of the current active containers.<br/></br>' +
                            '<b>Containers:</b> Docker containers are similar to a directory. A Docker container holds everything that is needed for an application to run. Each container is created from a Docker image. Docker containers can be run, started, stopped, moved, and deleted. Each container is an isolated and secure application platform. Docker containers are the run component of Docker.' });

   /* End of Containers chart */
  } ]);