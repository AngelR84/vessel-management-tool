fibity.manager.app.controller('GTAntennasAddModalVC',['$scope','$modalInstance','tmpAntenna', function($scope,$modalInstance,tmpAntenna){

	 $scope.tmpAntenna = {};
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
	
    /*String*/ $scope.urlImgOrgBackground = "";
	 
	 asm.getEntityOfKindById(Organization.entityKind,"myOrganization")
		.then(function(entity){
			if(entity != null){
				org = new Organization();
				org.initFromEntity(entity);
				$scope.urlImgOrgBackground = org.urlImgBackground;
			}
	 }).done();


	if(tmpAntenna.id != ""){
		$scope.cambio = true; // activar modo edicion.
		$scope.tmpAntenna.name = tmpAntenna.name;
		$scope.tmpAntenna.location = tmpAntenna.location;
		$scope.tmpAntenna.section = tmpAntenna.section;
	}else{
		$scope.tmpAntenna.name = "";
		$scope.tmpAntenna.location = "";
		$scope.tmpAntenna.section = "";
	}
	
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

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
}]);







