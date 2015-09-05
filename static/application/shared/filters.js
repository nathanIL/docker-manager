angular.module('manager.filters',[])
    .filter('containerstatus',['ContainerStatus', function(ContainerStatus) {
            return function(element,type) {
                var res;
                if (type == "status") {
                    res = ContainerStatus.get(element).status;
                } else if(type == "time") {
                    res = ContainerStatus.get(element).time;
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