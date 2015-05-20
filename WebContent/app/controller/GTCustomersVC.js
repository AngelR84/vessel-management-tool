fibity.manager.app.controller('GTCustomersVC',['$scope', '$routeParams',  function($scope,$routeParams){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	
	$scope.title = "Cliente";
	$scope.activeitem = "customers";
	//$scope.param = $routeParams.param;
	
	/*List*/ $scope.cabecera = ["Foto","Nombre","Apellidos","Puntos","Ultima Visita"];
	/*List*/ $scope.nombre = ['Jorge','Ruben','Jhuliana','Olena','Angel'];
	/*List*/ $scope.apellido = ['Rodriguez','Torres',"Garcia","Gomez","Casado"]; 
	/*List*/ $scope.foto = ['1.jpg',"2.jpeg","3.jpeg","4.jpeg","5.jpeg",'6.jpeg',"7.jpeg","8.jpeg","9.jpeg","10.jpeg",
	                       '11.jpeg',"12.jpeg","13.jpeg","14.jpeg","15.jpeg",'16.jpeg',"17.jpeg","18.jpeg","19.jpeg","20.jpeg",
	                       "21.jpeg","22.jpeg","23.jpeg","24.jpeg"];
	/*List*/ $scope.puntos = [30,20,35,22,10];
	/*List*/ $scope.visita = ['Ayer','15:53 PM',"3 de Junio",'17:34 PM','9:00 AM','10 de Julio','22:11 PM',"13 de Julio","15 de Septiembre","12:00 PM"];
	  
	  
	/*String*/ $scope.titleList = "Vista Modo Lista";
	/*String*/ $scope.titleCollec = "Vista Modo Icono";
	  
	/*Map*/	     	  $scope.customersList = {}; //Mapa que contiene todos los objetos antenna del modelo
	/*List<String>*/  $scope.customersKeyList = []; // Lista de ids de los objetos antenna del modelo
	  
	Customers.fromEntityList(asm.getAllEntitiesOfKind(Customers.entityKind))
	.then(function(list){
		list.forEach(function(customers){
			$scope.customersKeyList.push(customers.id);
			$scope.customersList[customers.id] = customers;
		});
	}).done();
	 
	 $scope.crearlista = function(){
	       for(var i = 0; i < 3 ; i++)
	              {
	    	   var rng1 = Math.floor((Math.random() * 5) + 1);
	 	      var rng2 = Math.floor((Math.random() * 24) + 1);
	 	      var rng3 = Math.floor((Math.random() * 10) + 1);
	    	   		 $scope.tmpCustomers = new Customers();
	    	   		 $scope.tmpCustomers.init({});
	                 $scope.tmpCustomers.name = $scope.nombre[rng1];
	                 $scope.tmpCustomers.apellido = $scope.apellido[rng1];
	                 $scope.tmpCustomers.foto = $scope.foto[rng2];
	                 $scope.tmpCustomers.puntos = $scope.puntos[rng1];
	                 $scope.tmpCustomers.lastVisita = $scope.visita[rng3];
	                 $scope.tmpCustomers.save(); 
	                 $scope.customersList[$scope.tmpCustomers.id] = $scope.tmpCustomers;
	                 $scope.customersKeyList.push($scope.tmpCustomers.id);
	              }  
	    };
	  
	 $scope.borrarlista = function()
	    { 
	      asm.removeAllEntitiesOfKind(Customers.entityKind);
	      $scope.customersKeyList = [];
	    };	    
	
}]);