fibity.manager.app.controller('GTBillingAddModalVC',['$scope', '$modalInstance', 'tmpbilling',  function($scope,$modalInstance,tmpbilling){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	
	console.log("Dentro"+tmpbilling);
	$scope.tmpbilling = tmpbilling;
	
	if($scope.tmpbilling.name == "" && $scope.tmpbilling.apellido == "" && $scope.tmpbilling.dni == ""){
		$scope.chequeandoEmpr = true;
		$scope.empr = true;
		$scope.aut = false;
	} 
	if($scope.tmpbilling.razonSocial == "" && $scope.tmpbilling.cif == ""){
		$scope.chequeandoAut = "checked"; 
		$scope.aut = true;
		$scope.empr = false;
	}
	
	

    /*bool*/ $scope.dni = false; // cambio de empresa
    /*bool*/ $scope.nif = true; // cambio de autonomo
    
    // placeholders
    
    /*String*/ $scope.plcrs = "Raz\u00f3n Social";
    /*String*/ $scope.plccif = "CIF";
    /*String*/ $scope.plcnb="Nombre";
    /*String*/ $scope.plcap="Apellidos";
    /*String*/ $scope.plcdni="00000000A";
    /*String*/ $scope.plcnif="X0000000A";
    //ambos
    /*String*/ $scope.plcdir1="av. Orovilla 54";
    /*String*/ $scope.plcdir2="Direccion Opcional";
    /*String*/ $scope.plcpob="Madrid";
    /*String*/ $scope.plctel="910000000";
   	/*String*/ $scope.plccp="28041";    
    /*String*/ $scope.plcpro="Provincia";     
    // fin
    //autonomo    
    /*String*/ $scope.prov = ['Seleccionar Provincia','\u00e1lava','Albacete','Alicante/Alacant','Almer\u00eda','Asturias','\u00e1vila','Badajoz','Barcelona','Burgos',
                             'C\u00e1ceres','C\u00e1diz','Cantabria','Castell\u00f3n','Ceuta','Ciudad real','C\u00f3rdoba','Cuenca',
                             'Girona','Las Palmas','Granada','Guadalajara','Guip\u00fazcoa','Huelva','Huesca','Illes Balears',
                             'Ja\u00e9n','A Coru\u00f1a','La Rioja','Le\u00f3n','Lleida','Lugo','Madrid','M\u00e1laga','Melilla','Murcia',
                             'Navarra','Ourense','Palencia','Pontevedra','Salamanca','Segovia','Sevilla','Soria',
                             'Tarragona','Santa Cruz de Tenerife','Teruel','Toledo','Valencia/Val\u00e9ncia','Valladolid',
                             'Vizcaya','Zamora','Zaragoza'];
    
    $scope.tmpbilling.provincia == "" ? $scope.pro = $scope.prov[0] : $scope.pro = $scope.tmpbilling.provincia;
    	
    	$scope.bmRS = false;
    	$scope.bmNB = false;
    	$scope.bmAp = false;
    	$scope.bmDI = false;
    	$scope.bmPB = false;
    	$scope.bmCP = false;
    	$scope.bmPV = false;
    	$scope.bmTF = false;
	    $scope.bmCF = false;
	    $scope.bmDN = false;
	    $scope.bmNF = false;
	    $scope.boton = true;
     
	    if($scope.tmpbilling.razonSocil == "" && $scope.tmpbilling.cif == "" &&
	    		$scope.tmpbilling.direccion1 == "" && $scope.tmpbilling.poblacion == "" && $scope.tmpbilling.codigoPostal == "" &&
	    		$scope.tmpbilling.provincia == "" && $scope.tmpbilling.telefono == "")
	    		{
	    			$scope.boton = true;
	    		}
	    	else{
	    		if($scope.tmpbilling.name == "" && $scope.tmpbilling.apellido == "" && $scope.tmpbilling.dni == "" && 
	    				$scope.tmpbilling.direccion1 == "" && $scope.tmpbilling.poblacion == "" && $scope.tmpbilling.codigoPostal == "" &&
	    				$scope.tmpbilling.provincia == "" && $scope.tmpbilling.telefono == "")
	    			{
	    				$scope.boton = true;
	    			}
	    		else{
	    			$scope.boton = false;
	    		}
	    	}
	    
      $scope.activar1 = function()  {
        $scope.empr = true;
        $scope.aut = false;
        $scope.bmNB = false;
        $scope.bmAP = false;
        $scope.bmDN = false;
        $scope.bmNF = false;
        $scope.tmpbilling.dni = "";
        $scope.tmpbilling.name = "";
        $scope.tmpbilling.apellido = "";
        $scope.boton = true;
        $scope.generarboton();
      };

      $scope.activar2 = function(){
    	  $scope.empr = false;
    	  $scope.aut = true;
    	  $scope.bmRS = false;
    	  $scope.bmCF = false;
    	  $scope.tmpbilling.cif = "";
    	  $scope.tmpbilling.razonSocial = "";
    	  $scope.boton = true;
    	  $scope.generarboton();
      };  
      
      $scope.cambioValor = function(prov){
      	if(prov == $scope.prov[0])
      		{
      			$scope.bmPV = false;
      		}
      	else
      		{
      			$scope.tmpbilling.provincia = prov;
      			$scope.bmPV = true;
      			$scope.generarboton();
      		}
      };
      
      $scope.actualizarRazonSocial = function(){
    	  $scope.tmpbilling.razonSocial.length >= 5 ? $scope.bmRS = true : $scope.bmRS = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarNombre = function(){
    	  $scope.tmpbilling.name.length >= 5 ? $scope.bmNB = true : $scope.bmNB = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarApellido = function(){
    	  $scope.tmpbilling.apellido.length >= 5 ? $scope.bmAP = true : $scope.bmAP = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarDireccion = function(){
    	  $scope.tmpbilling.direccion1.length >= 5 ? $scope.bmDI = true : $scope.bmDI = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarPoblacion = function(){
    	  $scope.tmpbilling.poblacion.length >= 5 ? $scope.bmPB = true : $scope.bmPB = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarCodigoPostal = function(){
    	  $scope.tmpbilling.codigoPostal.length == 5 ? $scope.bmCP = true : $scope.bmCP = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarTelefono = function(){
    	  $scope.tmpbilling.telefono.length == 9 ? $scope.bmTF = true : $scope.bmTF = false;
    	  $scope.generarboton();
      };
      
      $scope.comprobarCIF = function() {
          var cif = /^[a-zA-Z]{1}[0-9]{8}$/;
            if($scope.tmpbilling.cif.length == 9)
                  {
                      if(cif.test($scope.tmpbilling.cif) == true)
                          {
                              $scope.bmCF = true;
                              $scope.generarboton();
                          }
                      else
                          {
                              $scope.bmCF = false;
                              $scope.generarboton();
                          } 
                  }
                  else{
                      $scope.bmCF = false;
                      $scope.generarboton();
                  }
              
         };
      
      $scope.verificarDni = function() {
      var dni = /^[0-9]{8}[a-zA-Z]{1}$/;
      var nif = /^[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1}$/;
      
        if($scope.tmpbilling.dni.length == 9)
              {
                  if(dni.test($scope.tmpbilling.dni) == true)
                      {
                          $scope.bmDN = true;
                          $scope.generarboton();
                      }
                  else
                      {
                          $scope.bmDN = false;
                          $scope.generarboton();
                      } 
                  
                   if(nif.test($scope.tmpbilling.dni) == true)
                      {
                          $scope.bmNF = true;
                          $scope.generarboton();
                      }
                  else
                      {
                          $scope.bmNF = false;
                          $scope.generarboton();
                      }  
              }
              else
              {
                  $scope.bmDN = false;
                  $scope.bmNF = false;
                  $scope.generarboton();
              }
          
      };
      
      
     $scope.generarboton = function(){
    	if($scope.bmNB && $scope.bmAP && $scope.bmDN && $scope.bmDI && $scope.bmPB && $scope.bmCP && $scope.bmPV && $scope.bmTF)
    		{
    			$scope.boton = false;
    		}
    	else
    		{
    			if($scope.bmNB && $scope.bmAP && $scope.bmNF && $scope.bmDI && $scope.bmPB && $scope.bmCP && $scope.bmPV && $scope.bmTF)
    				{
    					$scope.boton = false;
    				}
    			else
    				{
    					if($scope.bmRS && $scope.bmCF && $scope.bmDI && $scope.bmPB && $scope.bmCP && $scope.bmPV && $scope.bmTF)
    						{
    							$scope.boton = false;
    						}
    					else
    						{
    							$scope.boton = true;
    						}	
    				}	
    		}
     };
      
     $scope.ok = function () { 
 	    $modalInstance.close($scope.tmpbilling);
 	  };

 	  $scope.cancel = function () {
 	    $modalInstance.dismiss('cancel');
 	  };
}]);


















