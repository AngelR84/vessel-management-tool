fibity.manager.app.controller('GTAntennasVC',['$scope','$routeParams', '$window',  function($scope,$routeParams,$window){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});

	$scope.path = [{"name":"Antenas", "href": "#/antennas/collection"}];
	$scope.activeitem = "antennas";
	
	/********************************************/

	//$scope.param = $routeParams.param;
	 $scope.listCab = ['Nombre','Lugar de instalaci\u00f3n','Departamento/Secci\u00f3n','Editar'];
	
     /* Mapa  */ $scope.antennaList = {};
     /* List  */ $scope.antennaKeyList = []; // Lista de ids de los objetos antenna del modelo

    Antenna.fromEntityList(asm.getAllEntitiesOfKind(Antenna.entityKind))
	.then(function(list){
		list.forEach(function(antenna){
			$scope.antennaKeyList.push(antenna.id);
			$scope.antennaList[antenna.id] = antenna;
			$scope.$apply();
		});
	}).done();

     $scope.openAntenna = function(id){
    	 	$window.location.href = "#/antennas/edit/" + id;
     };
	 $scope.openAntennaModal = function(id){
		  
		  var modalInstance;
		  
		if(id == undefined){
			tmpAntenna = new Antenna();
			tmpAntenna.init({});
			tmpAntenna.name = "";
			tmpAntenna.location = "";
			tmpAntenna.section = "";

			modalInstance = $modal.open({
		    	templateUrl: '../views/antennas_modal_add.html',
		      	controller: "GTAntennasAddModalVC",
		      	size:'sm',
		    	resolve: {
		    		tmpAntenna: function () {
			                    return tmpAntenna;
			                }
		    		}
			});
			
		}else{
			modalInstance = $modal.open({
		    	templateUrl: '../views/antennas_modal_add.html',
		      	controller: "GTAntennasAddModalVC",
		      	size:'sm',
		    	resolve: {
		    		tmpAntenna: function () {
			                    return $scope.antennaList[id];
			                }
		    		}
			});
			
		}

	    modalInstance.result.then(function (tmpAntenna) {
	    	tmpAntenna.save()
	    	  .then(function(mapa){
	    		  if( $scope.antennaList[tmpAntenna.id] == undefined){
	    		  	$scope.antennaList[tmpAntenna.id] = tmpAntenna;
	    		  	$scope.antennaKeyList.push(tmpAntenna.id);
	    	  	}
	         }).done();  
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	  
	  $scope.crearListaAnt = function(){
		  
	       for(var i = 1; i <= 10 ; i++)
	              {
	    	   		 tmpAntenna = new Antenna();
	    	   		 tmpAntenna.init({});
    				 tmpAntenna.name = "Antena "+i;
    				 tmpAntenna.location = "Madrid";
    				 tmpAntenna.section = "Madrid";
    				 tmpAntenna.save()
    		    	  .then(function(mapa){
    		            $scope.antennaList[tmpAntenna.id] = tmpAntenna;
    		            $scope.antennaKeyList.push(tmpAntenna.id);
    		         }); 
	              }  
	    };
	  
	 $scope.borrarListaAnt = function()
	    { 
	      asm.removeAllEntitiesOfKind(Antenna.entityKind);
	      $scope.antennaKeyList = [];
	    };	
}]);

	