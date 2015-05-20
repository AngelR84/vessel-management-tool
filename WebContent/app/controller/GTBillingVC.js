fibity.manager.app.controller('GTBillingVC',['$scope', '$routeParams', '$modal',  function($scope,$routeParams,$modal){
	
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	
	$scope.title = "Facturación";
	$scope.activeitem = "billing";
	$scope.visible = true;
	$scope.cabecera = ['Periodo','Cuota','Consumo','Iva','Total','Download'];
	$scope.periodo = ['Enero 2014','Febrero 2014','Marzo 2014','Abril 2014','Mayo 2014', 'Junio 2014'];
	$scope.cuota = 19;
	$scope.factura = [];
	
	/* Mapa  */ $scope.billingList = {};
    /* List  */ $scope.billingKeyList = [];
    $scope.tmpbilling = new Billing();
	// Creamos La Factura
			for(var i = 0 ; i < $scope.periodo.length; i++)
			{
				var rng1 = Math.floor((Math.random() * 120) + 1);
				while(rng1 < 20)
					{
						rng1 = Math.floor((Math.random() * 120) + 1);
					}
				$scope.iva = $scope.cuota + rng1 * 0.21;
				$scope.total = $scope.cuota + rng1 + $scope.iva;
				$scope.factura.push({'periodo':$scope.periodo[i],'cuota':$scope.cuota,'consumo':rng1,'iva':$scope.iva.toFixed(2),'total':$scope.total.toFixed(2)});
			}
	// fin de la creacion de la factura
	
		$scope.billingId = "MyBilling";	
			
		 asm.getEntityOfKindById(Billing.entityKind,$scope.billingId)
			.then(function(entity){
				if(entity == null){
					$scope.tmpbilling.initWithId(Billing.entityKind,$scope.billingId,{});
					$scope.tmpbilling.razonSocial = "";
					$scope.tmpbilling.cif = "";
					$scope.tmpbilling.name = "";
					$scope.tmpbilling.apellido = "";
					$scope.tmpbilling.dni = "";
					$scope.tmpbilling.direccion1 = "";
					$scope.tmpbilling.direccion2 = "";
					$scope.tmpbilling.poblacion = "";
					$scope.tmpbilling.codigoPostal = "";
					$scope.tmpbilling.provincia = "";
					$scope.tmpbilling.telefono = "";
				}
				else
					{
						$scope.tmpbilling.initFromEntity(entity);
						$scope.tmpbilling.name == "" && $scope.tmpbilling.apellido == "" && $scope.tmpbilling.dni == "" ? $scope.visible = false : $scope.visible = true;
					}
				
			});
				
			$scope.openBillingModal = function () {
				var modalInstance; 
						modalInstance = $modal.open({
					    	templateUrl: '../views/billingEdit.html',
					      	controller: "GTBillingAddModalVC",
					    	resolve: {
					    		tmpbilling: function () {
						                    return $scope.tmpbilling;
						                }
					    		}
						});
					

				    modalInstance.result.then(function (tmpbilling) {
				    	tmpbilling.save();
				    }, function () {
				      $log.info('Modal dismissed at: ' + new Date());
				    });
				  };
}]);
