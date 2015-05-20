fibity.manager.app.controller('GTAntennasMapVC',['$scope','$routeParams','$modal', function($scope,$routeParams,$modal){
	/**
	 * Google Maps integration
	 */

	/******** Profile for TopBar Component *******/
	
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	
	$scope.path = [{"name":"Antenas", "href": "#/antennas"}, {"name":"Mapa", "href": "#/antennas/map"}];

	/********************************************/
	
	$scope.map = {center: {latitude: 40.358591, longitude: -3.68979 }, zoom: 18 };

	$scope.options = {
	          scrollwheel: true,
	          panControl: true,
	          streetViewControl: false,
	          zoomControlOptions : {
	            style: "SMALL"
	          }
	        };
    
    $scope.circles = [
                      {
                          id: 1,
                          center: {
                              latitude: 40.358650,
                              longitude: -3.69030
                          },
                          radius: 40,
                          stroke: {
                              color: '#08B21F',
                              weight: 2,
                              opacity: 1
                          },
                          fill: {
                              color: '#08B21F',
                              opacity: 0.5
                          },
                          geodesic: true, // optional: defaults to false
                          draggable: false, // optional: defaults to false
                          clickable: false, // optional: defaults to true
                          editable: false, // optional: defaults to false
                          visible: true // optional: defaults to true
                      }
                  ];
	
	$scope.title = "Mapa de Antenas (Fibity Zone)";
	$scope.activeitem = "antennas";
	$scope.marker = {
            id:0,
            coords: {
           	    latitude: 40.358650,
                longitude: -3.69030
            },
            options: { draggable: false },
            title: "Antena Fibity",
            icon: fibity.manager.path + "/images/fibity_marker.png",
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    $log.log(marker.getPosition().lat());
                    $log.log(marker.getPosition().lng());
                    	$scope.circles[0].center.latitude = marker.getPosition().lat();
                    	$scope.circles[0].center.longitude = marker.getPosition().lng();
                   
                }
            }
    };
}]);

	