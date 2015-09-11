angular.module('manager.filters',[])
    .filter('containerstatus',['ContainerStatus', function(ContainerStatus) {
            return function(element,type) {
                var res;

                switch (type) {
                    case "status":
                        res = ContainerStatus.get(element).status;
                        break;
                    case "time":
                        res = ContainerStatus.get(element).time;
                        break;
                    case "style":
                        var status = ContainerStatus.get(element).status;

                        if (status == "Created")
                            res = "info";
                        else if (status == "Running")
                            res = "success";
                        else if (status == "Paused")
                            res = "info";
                        else
                            res = "warning";
                        break;
                }
                return res;
            }
 }])
 .filter('containernames',function() {
            return function(element) {
                    var names = element.Names.map( function(val,idx,arr) {
                        return val.substring(1);

                    } ).join(',');
                    return names;
            }
 })
 .filter('containerimage',function() {
            return function(element) {
                    return element.Image;
            }
 });