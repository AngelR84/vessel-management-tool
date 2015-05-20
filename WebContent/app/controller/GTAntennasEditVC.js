fibity.manager.app.controller('GTAntennasEditVC',['$scope','$routeParams','$window',function($scope,$routeParams,$window){

	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});

	$scope.path = [{"name":"Antenas", "href": "#/antennas/collection"}];
	$scope.activeitem = "antennas";
	$scope.mapInstance = null; //Google Map Instance
	/**********
	 * 
	 * 
	 * 
	 * **********************************/
 
	
	$scope.myswitch = true;
	$scope.floor = 1;
	$scope.area = 20;
	$scope.currencyFormatting = function(value) { 
		return "planta " + value.toString();
	};

	$scope.ocupationLevelList = ["Sin obstaculos","Bajo","Medio","Alto","Muy Alto"];
	
	$scope.location = {}; // GeoLocation
	$scope.address = "";  // Address
	$scope.antenaModelImg = fibity.manager.path + "/images/fibity_antenna.png";
	$scope.markerLocation = {latitude: 40.358650, longitude: -3.69030 };
	$scope.searchLocation  = function(){
		if($scope.location != null){
			var json = JSON.stringify($scope.location);
			$scope.marker.coords = JSON.parse(json);
			$scope.map.center = JSON.parse(json);
			$scope.map.zoom = 18;
			//$scope.$apply();
		}
	};

	
	/*
	$scope.$watch('location',function(newValue,oldValue){
		$scope.marker.coords = $scope.location;
		$scope.map.center = $scope.location;	
	});*/
	
	$scope.map = {center: {latitude: 40.358650, longitude: -3.69030 },
			 	  zoom: 18,
			 	 events: {
					    tilesloaded: function (map) {
						    		$scope.mapInstance = map;
					    }
				  }};
	$scope.options = {
	          scrollwheel: false,
	          panControl: true,
	          streetViewControl: false,
	          zoomControlOptions : {
	            style: "SMALL"
	          }
	        };
	$scope.marker = {
            id:0,
            coords: {
           	    latitude: 40.358650,
                longitude: -3.69030
            },
            options: { draggable: true },
            title: "Antena Fibity",
            icon: fibity.manager.path + "/images/fibity_marker.png",
            events: {
                dragend: function (marker, eventName, args) {
                		$scope.markerLocation.latitude = marker.getPosition().lat();
                		$scope.markerLocation.longitude = marker.getPosition().lng();
                    	$scope.$apply();
                }
            }
    };
	
	
	/* *****************************************
	 * 
	 * 
	 * *****************************************/
	

	$scope.guapuCenter = {
            lat: 40.358650,
            lng: -3.69030,
            zoom: 18
        };
        
	$scope.markers = {
            guapuMarker: {
                lat: 40.358650,
                lng: -3.69030,
                message: "I want to travel here!",
                focus: true,
                draggable: true
            }
        };
	
     $scope.defaults = {
            scrollWheelZoom: false
     };

	
	/* *****************************************
	 * 
	 * 
	 * *****************************************/

	 $scope.tmpAntenna = new Antenna();
	 $scope.originalAntenna = new Antenna();
	 $scope.activation = {};
	/*String*/ $scope.activation.txtcasilla1  = "";
	/*String*/ $scope.activation.txtcasilla2  = "";
	/*String*/ $scope.activation.txtcasilla3  = "";
	/*String*/ $scope.activation.txtcasilla4  = "";
    
    /*bool*/ $scope.ca1=false;
    /*bool*/ $scope.ca2=false;
    /*bool*/ $scope.ca3=false;
    /*bool*/ $scope.ca4=false;
    /*bool*/ $scope.boton1 = true;
    /*bool*/ $scope.boton2 = true;
    /*bool*/ $scope.cambio = false;
    /*bool*/ $scope.txtfocus1 = true;
    /*bool*/ $scope.txtfocus2 = false;
    /*bool*/ $scope.txtfocus3 = false;
    /*bool*/ $scope.txtfocus4 = false;
    /*bool*/ $scope.txtfocus5 = false;
    /*bool*/ $scope.txtfocus6 = false;
	
    $scope.saving = false;
    
	$scope.loadOriginal = function(){
		/*$scope.hideButtons();
		$scope.visibility.visible = false;*/
		$scope.tmpAntenna.initFromEntity($scope.originalAntenna);
		$scope.path = [{"name":"Antenas", "href": "#/antennas/collection"},
		               {"name":$scope.tmpAntenna.serialNumber, "href": "#/antennas/edit/" + $scope.tmpAntenna.id}];
		//$scope.$apply();
	};
    asm.getEntityOfKindById(Antenna.entityKind,$routeParams.antennaId).then(function(entity){
		if(entity == null){
			$window.history.back();
		}else{
			$scope.originalAntenna.initFromEntity(entity);
			$scope.loadOriginal();
		}
		
		
	}).done();

    
    $scope.saveChanges = function(){
    		$scope.saving = true;
    		$scope.tmpAntenna.save().then(function(map){
    			$scope.originalAntenna.initFromEntity($scope.tmpAntenna);
    			$scope.saving = false;
    			$scope.$apply();
    		});
    };
    
	
    $scope.actualizarCasilla1 = function(){
    	if($scope.activation.txtcasilla1.length == 5)
    		{ 
    			$scope.ca1 = true;
    			$scope.txtfocus2 = true;
    		}
    	else
    		{
    			$scope.ca1 = false;
    		}
    	
    	$scope.activation.txtcasilla1 = $scope.activation.txtcasilla1.toUpperCase();
    	$scope.generarboton();
      };
      
      $scope.actualizarCasilla2 = function(){
      	if($scope.activation.txtcasilla2.length == 5)
      		{ 
      			$scope.ca2 = true;
      			$scope.txtfocus3 = true;
      		}
      	else
      		{
      			$scope.ca2 = false;
      		}
      		$scope.activation.txtcasilla2 = $scope.activation.txtcasilla2.toUpperCase();
	    	$scope.generarboton();
        };
        
        $scope.actualizarCasilla3 = function(){
        	if($scope.activation.txtcasilla3.length == 5)
        		{ 
        			$scope.ca3 = true;
        			$scope.txtfocus4 = true;
        		}
        	else
        		{
        			$scope.ca3 = false;	
        		}
        	$scope.activation.txtcasilla3 = $scope.activation.txtcasilla3.toUpperCase();
	    	$scope.generarboton();
          };  
      
        $scope.actualizarCasilla4 = function(){
          	if($scope.activation.txtcasilla4.length == 5)
          		{ 
          			$scope.ca4 = true;
          			$scope.txtfocus5 = true;
          		}
          	else
          		{
          			$scope.ca4 = false;
          		}
	  			$scope.activation.txtcasilla4 = $scope.activation.txtcasilla4.toUpperCase();
	  	    	$scope.generarboton();
            };
            
      $scope.comprobar = function(){
    	  $scope.tmpAntenna.name.length >=5 && $scope.tmpAntenna.location.length >=5 && $scope.tmpAntenna.section.length >=5 ? $scope.boton2 = false : $scope.boton2 = true;
      };  
	
      $scope.generarboton = function(){
    	  $scope.ca1 && $scope.ca2 && $scope.ca3 && $scope.ca4 ? $scope.boton1 = false : $scope.boton1 = true;
      };
    
      $scope.changeView = function(){
    	  $scope.cambio = true;
    	  $scope.txtfocus6 = true;
      };
	
	  $scope.ok = function () { 
		tmpAntenna.name = $scope.tmpAntenna.name;
		tmpAntenna.location = $scope.tmpAntenna.location;
		tmpAntenna.section = $scope.tmpAntenna.section;
	    $modalInstance.close(tmpAntenna);
	  };
	  
	  

}]);