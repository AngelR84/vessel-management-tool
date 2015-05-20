fibity.manager.app.controller('GTInfoCardAddModalVC',['$scope','$modalInstance', 'tmpInfocard','fileReader',  function($scope,$modalInstance,tmpInfocard,fileReader){
	  
	 	$scope.tmpInfocard = {};
	 	if(tmpInfocard.id != "")
	 		{
	 			$scope.tmpInfocard.title = tmpInfocard.title;
	 			$scope.tmpInfocard.description = tmpInfocard.description;
	 			$scope.tmpInfocard.urlImg = tmpInfocard.urlImg;	
	 			$scope.defaultTitle = $scope.tmpInfocard.title;
	 			$scope.defaultDescription = $scope.tmpInfocard.description;
	 			$scope.tmpInfocard.urlImg = $scope.tmpInfocard.urlImg;
	 		}
	 	else
	 		{
	 			/*String*/ $scope.defaultTitle = "Desayuno 0,99€"; // espejo del titulo con un valor predeterminado
				/*String*/ $scope.defaultDescription = "Esto es un desayuno que incluye café, zumo y fruta."; //espejo de la descripcion con valor predeterminado.
				/*String*/ $scope.tmpInfocard.urlImg = "http://lasaventurasdeperle.com/wp-content/uploads/2012/07/chile.jpg";
				
				
				// Atributo para comprobar si las casillas estan rellenas
				/*bool*/ $scope.btn1 = false;
				/*bool*/ $scope.btn2 = false;
				
				//Atributo que comprueba si la imagen ha sido cambiada
				/* bool Img */ $scope.bmImgBack = false;
				// Atributo para activar el boton de guardar
				/*bool*/ $scope.boton = true;
	 		}
	 	
	 	/*String*/ $scope.title = "Tarjeta de Información";
		/*String*/ $scope.plctitleInfocard = "Desayuno 0,99€";
		/*String*/ $scope.plcdescription = "Esto es un desayuno que incluye café, zumo y fruta.";
	    /*String*/ $scope.urlImgOrgBackground = "";
		/*List*/   $scope.visibility = {};
		/*bool*/   $scope.visibility.visible = true;
		/*bool*/   $scope.visibility.botonLoading = false;
	    $scope.images = {};
	    
		 asm.getEntityOfKindById(Organization.entityKind,asm.getCurrentOrganizationId())
			.then(function(entity){
				if(entity != null){
					org = new Organization();
					org.initFromEntity(entity);
					$scope.urlImgOrgBackground = org.urlImgBackground;
					$scope.$apply();
				}
		 }).done();
		
		 $scope.$watch("tmpInfocard.title",function(newValue,oldValue){
			 newValue.length == 0 ? $scope.defaultTitle = "Desayuno 0,99€" : $scope.defaultTitle = newValue;
			 newValue.length >= 5 ? $scope.btn1 = true : $scope.btn1 = false;
			 $scope.generarboton();
		 });
		 
		 $scope.$watch("tmpInfocard.description",function(newValue,oldValue){
			 newValue.length == 0 ? $scope.defaultDescription = "Esto es un desayuno que incluye café, zumo y fruta." : $scope.defaultDescription = newValue;
			 newValue.length >= 5 ? $scope.btn2 = true : $scope.btn2 = false;
			 $scope.generarboton();
		 });

		 $scope.$watch("tmpInfocard.urlImg",function(newValue,oldValue){
			 newValue != oldValue ? $scope.bmImgBack = true : $scope.bmImgBack = false;
		 });
		 
		 $scope.generarboton = function(){
				$scope.btn1 && $scope.btn2 ? $scope.boton = false : $scope.boton = true;
			};	
				
			
	  $scope.guardarCambios = function(){
		  var fileImg = [];
		  $scope.visibility.visible = false;
		  $scope.visibility.botonLoading = true;
		  $scope.boton = true;
		  if($scope.bmImgBack) fileImg.push($scope.images.fileUrlImg);
		  
		  if(fileImg.length > 0){
			  asm.uploadImages(fileImg).then(function(res){
					 if($scope.bmImgBack) $scope.tmpInfocard.urlImg = res[$scope.images.fileUrlImg.name];
					 tmpInfocard.title = $scope.tmpInfocard.title;
					 tmpInfocard.description =$scope.tmpInfocard.description;
					 tmpInfocard.urlImg = $scope.tmpInfocard.urlImg;
			   		 $modalInstance.close(tmpInfocard);
				  }).done();
		  }
		  else{
			  tmpInfocard.title = $scope.tmpInfocard.title;
			  tmpInfocard.description =$scope.tmpInfocard.description;
			  tmpInfocard.urlImg = $scope.tmpInfocard.urlImg;
			 $modalInstance.close(tmpInfocard);
		  }
	  };
			
	
	  $scope.ok = function () { 
		 $scope.guardarCambios(); 
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
}]);





























