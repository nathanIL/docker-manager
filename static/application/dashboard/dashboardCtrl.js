angular.module('manager.dashboard',[])
  .controller('dashboardCtrl',['$scope','Image', function($scope,Image) {

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
        console.log(aggregator);
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
    /* End of Images creation trend chart population */

  } ]);