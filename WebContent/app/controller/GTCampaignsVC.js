fibity.manager.app.controller('GTCampaignsVC',['$scope','$window', function($scope,$window){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	
	$scope.path = [{"name":"Campañas", "href": "#/campaigns/collection"}];
	$scope.activeitem = "campaigns";
	/********************************************/
	
	
	$scope.antennasSchedulesMap = {};
	//$scope.param = $routeParams.param;
	
	/*List<String>*/ $scope.cabeceras = ['Nombre de la Campaña','InfoCard','Antenas','Editar'];  // cabecera para la lista

	/*bool*/ $scope.btnCamp2;
	
	/*Map<String, CampaignsSchedule>*/ $scope.schedulecampList = {}; 
		/*List<String>*/ 	  $scope.schedulecampKeyList = [];  
    	  
    	 /*Map<String>*/   $scope.infoCardList = []; //Mapa que contiene todos los objetos Infocard del modelo
    	 /*Map<String>*/   $scope.infoCardMap = {}; //Mapa que contiene todos los objetos Infocard del modelo

    	
    	$scope.entitiesLoadedNumber = 0;
    	$scope.entityLoaded = function(){
    			$scope.entitiesLoadedNumber++;
    			if($scope.entitiesLoadedNumber == 2)
    				$scope.$apply();
    			
    	};

    	$scope.loadInfocards = function(){   
	    	InfoCard.fromEntityList(asm.getAllEntitiesOfKind(InfoCard.entityKind))
	    		.then(function(list){
	    			list.forEach(function(infocard){
	    				var ic = new InfoCard();
	    				ic.initFromEntity(infocard);
	    				$scope.infoCardMap[ic.id] = ic;
	    				$scope.infoCardList.push(ic);
	    			});
	    			list.length == 0 ? $scope.btnCamp2 = true : $scope.btnCamp2 = false;
	    	}).finally(function(){
		  		$scope.entityLoaded();
		 }).done();
	};
	
    	$scope.loadCampaigns = function(){
	    Campaign.fromEntityList(asm.getAllEntitiesOfKind(Campaign.entityKind))
	    .then(function(list){
			list.forEach(function(campaignsSchedule){
				
				camp = new Campaign();
				camp.initFromEntity(campaignsSchedule);
				$scope.schedulecampList[camp.id] = camp;
				$scope.schedulecampKeyList.push(camp.id);
		
			});	
	  	}).finally(function(){
	  		$scope.entityLoaded();
	  	}).done(); 
    
    	};

	$scope.openCampaign = function(id){
  	 	$window.location.href = "#/campaigns/edit/" + id;
	};
	
	$scope.init = function(){
		$scope.loadCampaigns();
		$scope.loadInfocards();
	};
	
	
	$scope.init();
	
}]);





















