fibity.manager.app.controller('GTInfoCardsVC',['$scope', '$http', '$routeParams','$modal', function($scope,$http,$routeParams,$modal){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	$scope.path = [{"name":"Contenido", "href": "#/infocard/collection"}];
	
	/**
	 * ******************************************/
	
	$scope.activeitem = "infocard";
	//$scope.param = $routeParams.param;
	
	
	 /* List<String> */ 	    $scope.cabeceras	        = ['Imagen','Titulo','Descripción','Editar'];
	 /* Map<String, InfoCard>*/ $scope.infoCardList     = {}; 
	 /* List<String> */ 	    $scope.infoCardKeyList  = [];
	
	$scope.functionInfocardEntity = function(){
	 	InfoCard.fromEntityList(asm.getAllEntitiesOfKind(InfoCard.entityKind))
		.then(function(list){
			list.forEach(function(infocard){
				info = new InfoCard();
				info.initFromEntity(infocard);
				
				$scope.infoCardKeyList.push(info.id);
				$scope.infoCardList[info.id] = info;
				$scope.$apply();
			});
		}).done();
	};
	 
	$scope.functionInfocardEntity();
	
	 $scope.openInfocardModal = function (id) {
		  
		  var modalInstance;
		  
		if(id == undefined){
			var tmpInfocard = new InfoCard();
			tmpInfocard.init({});
			tmpInfocard.urlImg = "";
			tmpInfocard.title  = "";
			tmpInfocard.description = "";
			modalInstance = $modal.open({
		    	templateUrl: '../views/infocards_modal_add.html',
		      	controller: "GTInfoCardAddModalVC",
		    	resolve: {
		    		tmpInfocard: function () {
			                    return tmpInfocard;
			                }
		    		}
			});
			
		}else{
			var tmpInfocard = $scope.infoCardList[id];
			modalInstance = $modal.open({
		    	templateUrl: '../views/infocards_modal_add.html',
		      	controller: "GTInfoCardAddModalVC",
		    	resolve: {
		    		tmpInfocard: function () {
			                    return tmpInfocard;
			                }
		    		}
			});
			
		}

	    modalInstance.result.then(function (tmpInfocard) {
	    	tmpInfocard.save()
	    	  .then(function(mapa){
	    		if($scope.infoCardList[tmpInfocard.id] == undefined){
	            $scope.infoCardList[tmpInfocard.id] = tmpInfocard;
	            $scope.infoCardKeyList.push(tmpInfocard.id);
	            }
	    		
	    		$scope.$apply(function(){
	    			  $scope.functionInfocardEntity();
	    		  });
	         }).done();  
	    	$scope.$apply();
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	
}]);







