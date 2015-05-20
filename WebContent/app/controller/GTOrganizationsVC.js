fibity.manager.app.controller('GTOrganizationsVC',['$scope',function($scope){

	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	$scope.path = [{"name":"Opciones", "href": "#/config"},{"name":"Organization", "href": "#/config/organization"}];
	/********************************************/

	/*Atributo*/ $scope.activeitem = "organization";
	
	/* bool */   $scope.boton = true;
	/* bool */   $scope.btn1 = false;
	/* bool */   $scope.btn2 = false;
	/* bool */   $scope.btn3 = false;
	/* bool */	 $scope.defaultFalse = false;
	/* Map  */	 	 $scope.visibility = {};
	/* bool */   $scope.visibility.visible = false;
	/* bool */ 	 $scope.visibility.bm1 = false;
	
	/* bool Img */ $scope.bmImgLogo = false;
	/* bool Img */ $scope.bmImgBack = false;
	/*Img Loading*/ $scope.loading = "images/36.gif";

	/*String*/   $scope.Organizationid = asm.getCurrentOrganizationId();
	/*String*/   $scope.tmpOrganization = new Organization();
	/*String*/   $scope.originalOrganization = new Organization();
	/* Atributo temporal de la entity */

	/**
	 * generarboton()
	 * 
	 *  Comprueba si el botón debe ser visible o no y en caso afirmativo lo activa.
	 */
	$scope.generarboton = function(){
		$scope.btn1 && $scope.btn2 && $scope.btn3 ? $scope.boton = false : $scope.boton = true; 
	};
	
	$scope.showButtons = function(){
		$scope.visibility.visible = true;
	};
	
	$scope.hideButtons = function(){
		$scope.visibility.visible = false;
	};

	/**
	 * initWatches
	 * 
	 * Crea la escucha de las casillas de texto;
	 * 
	 */
	$scope.initWatches = function() {	
		
		$scope.$watch('tmpOrganization.name',function(newValue,oldValue){
			$scope.tmpOrganization.name.length >= 5 ? $scope.btn1 = true : $scope.btn1= false;
			$scope.tmpOrganization.name.length == 0 ? $scope.txtEspNombre = "Bar Mauricio" : $scope.txtEspNombre = $scope.tmpOrganization.name;
			newValue == oldValue ? $scope.hideButtons() : $scope.showButtons();
			$scope.generarboton();
		});
		
		$scope.$watch('tmpOrganization.slogan',function(newValue,oldValue){
			$scope.tmpOrganization.slogan.length >= 5 ? $scope.btn2 = true : $scope.btn2 = false;	
			$scope.tmpOrganization.slogan.length == 0 ? $scope.txtEspslogan = "Desayuno 0.99€" : $scope.txtEspslogan = $scope.tmpOrganization.slogan;
			newValue == oldValue ? $scope.hideButtons() : $scope.showButtons();
		 	$scope.generarboton();	
		});
		
		$scope.$watch('tmpOrganization.description',function(newValue,oldValue){
			$scope.tmpOrganization.description.length >= 10 ? $scope.btn3 = true : $scope.btn3 = false;
			newValue == oldValue ? $scope.hideButtons() : $scope.showButtons();
			$scope.generarboton();	
		});
		
		$scope.$watch("tmpOrganization.urlImgLogo",function(newValue,oldValue){
			newValue != oldValue ? $scope.bmImgLogo = true : $scope.bmImgLogo = false;
			newValue == oldValue ? $scope.hideButtons() : $scope.showButtons();
		});
			
		$scope.$watch("tmpOrganization.urlImgBackground",function(newValue,oldValue){
			newValue != oldValue ?  $scope.bmImgBack = true : $scope.bmImgBack = false;
			newValue == oldValue ? $scope.hideButtons() : $scope.showButtons();
		});

	};

	$scope.loadOriginal = function(){
		$scope.hideButtons();
		$scope.visibility.visible = false;
		$scope.tmpOrganization.initFromEntity($scope.originalOrganization);
	};
	
	/**
	 * Recuperamos la entidad Ornanización
	 */
	 asm.getEntityOfKindById(Organization.entityKind,$scope.Organizationid).then(function(entity){
		
		if(entity == null){
				$scope.originalOrganization.initWithId(Organization.entityKind,$scope.Organizationid,{});
				$scope.originalOrganization.urlImgBackground = "http://lasaventurasdeperle.com/wp-content/uploads/2012/07/chile.jpg";
				$scope.originalOrganization.urlImgLogo = "http://s3-eu-west-1.amazonaws.com/fibity/images/mauricio.png";
				$scope.originalOrganization.name = "";
				$scope.originalOrganization.slogan = "";
				$scope.originalOrganization.description = "";
				
				$scope.originalOrganization.socialWeb = "";
				$scope.originalOrganization.socialFacebook = "";
				$scope.originalOrganization.socialTwitter = "";
				$scope.originalOrganization.socialLinkedin = "";
				
		}else{
				$scope.originalOrganization.initFromEntity(entity);
		}
		$scope.loadOriginal();
		$scope.initWatches();
	}).done();
	
	/*	funciones de espejo */
	 
	 /**
	  * guardarCambios()
	  * 
	  * - activa el botón de espera
	  * - sube las imágenes que han sido modificadas
	  * - salva la organización con las modificaciones realizadas
	  * - oculta el botón
	  * 
	  */
	$scope.guardarCambios = function(){
			 
			 //Activamos el botón de espera
			 $scope.visibility.bm1 = true;
			 
			 //Inicializamos el array de ficheros.
			 var files = [];
			 
			 //Asignamos los ficheros modificados al array files
			 if($scope.bmImgLogo) files.push($scope.fileLogo);
			 if($scope.bmImgBack) files.push($scope.fileBackground);

			 //Si ha sido modificada alguna imagen, files.length es mayor que 0 y por tanto salvamos las imagenes en el servidor
             if(files.length > 0)
             {
            	 //Subir imagenes al servidor
            	 asm.uploadImages(files).then(function(res){
	            	 //Asignar urls a organizacion y salvar
            		 
            		 //Asignamos las urls de las imagenes modificadas
	            	 if($scope.bmImgLogo) $scope.tmpOrganization.urlImgLogo = res[$scope.fileLogo.name];
	            	 if($scope.bmImgBack) $scope.tmpOrganization.urlImgBackground = res[$scope.fileBackground.name];
	            	 //Salvamos la organización
	            	
	            	 $scope.tmpOrganization.save().then(function(mapa){
	            		 //Ocultamos el boton
	            		 $scope.initWatches(); 
	            		 $scope.visibility.bm1 = false;
	            		 $scope.$apply();
	            	 }).done();
	             }).done();
	           }else{
	        	 //Salvamos la organización
	            	 $scope.tmpOrganization.save().then(function(mapa){
	            		 //Ocultamos el boton
	            		 $scope.hideButtons();
	            		 $scope.tmpOrganization.initFromEntity($scope.tmpOrganization);
	            		 $scope.initWatches(); 
	            		 $scope.visibility.bm1 = false;
	            		 $scope.$apply();
	            	 }).done();
	           }
		};	
		
	    
	    $scope.discard = function(){
	    		$scope.loadOriginal();
	    		$scope.initWatches(); 
	    };

}]);




















