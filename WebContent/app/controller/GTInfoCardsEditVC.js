fibity.manager.app.controller('GTInfoCardAddModalVC',['$scope','$ionicSlideBoxDelegate','$location','$routeParams','$sce', function($scope,$ionicSlideBoxDelegate,$location,$routeParams,$sce){
	
	
		/******** Profile for TopBar Component *******/
		$scope.profile = {"name":"","lastname" : "","email" : ""};
		asm.getProfile().then(function(profile){ 
			$scope.profile.name = profile.name;
			$scope.profile.lastname = profile.lastname;
			$scope.profile.email = profile.email;
		});
		$scope.path = [{"name":"Tartejas de información", "href": "#/infocard/collection"}];
		
		/**
		 * ******************************************/
		
		$scope.title = "Tarjeta de Información";
		$scope.activeitem = "infocard";

		 
		/****************** IONIC ******************/	
		
		$scope.types = {};
		$scope.types.info = "INFO";
		$scope.types.menu = "MENU";
		$scope.types.url = "URL";
		$scope.types.offer = "OFFER";
		$scope.types.product = "PRODUCT";
		
		
		$scope.btnhidden = {};
		$scope.btnhidden.imgInfo = false;
		$scope.btnhidden.titulo = false;
		$scope.btnhidden.description = false;
		$scope.btnhidden.precio = false;
		$scope.btnhidden.url = false;
		$scope.btnhidden.listSlide = false;
		$scope.listText = false;
		$scope.boton = false;
		
		$scope.listslideimg = [];
		
		
		$scope.urlPage = "";
		$scope.preAnt = 0;
		$scope.preDes = 0;
		$scope.preAct = 0;
		
		/*
		 * Variables de titulo,slogan,description,url temporal
		 */
		
		$scope.tmpInfocard = {};
		$scope.tmpInfocard.title;
		$scope.tmpInfocard.slogan;
		$scope.tmpInfocard.description;
		$scope.tmpInfocard.urlImg = "http://lasaventurasdeperle.com/wp-content/uploads/2012/07/chile.jpg";
	
		/*String*/ $scope.title = "Tarjeta de Información";
		/*String*/ $scope.plctitleInfocard = "Desayuno 0,99€";
		/*String*/ $scope.plcsloganInfocard = "Todo un mundo de posibilidades";
		/*String*/ $scope.plcdescription = "Esto es un desayuno que incluye café, zumo y fruta.";
		
		$scope.infocard = new InfocardItem("Título","slogan","<p>description</p>",$scope.types.info,$scope.tmpInfocard.urlImg,$scope.urlPage,$scope.preAnt,$scope.preAct);
		
		$scope.actualitem = $scope.infocard;
		
		$scope.actualitem.urlPage = $sce.trustAsResourceUrl("http://www.fibity.com");
		$scope.defaultDescription = "Esto es un desayuno que incluye café, zumo y fruta";
		
		$scope.url = {};
		$scope.url.ok = false // deshabilitar boton para la comprobacion de la url
		$scope.url.page;
		
	
	/****************** END IONIC ******************/	
		
		$scope.actualizarUrl = function(newUrl)
			{
				console.log(newUrl);
				$scope.actualitem.urlPage = $sce.trustAsResourceUrl(newUrl);
			}
		
		
		$scope.$watch("tmpInfocard.title",function(newValue,oldValue){
			 if(newValue != undefined){
				 newValue.length == 0 ? $scope.defaultTitle = "Desayuno 0,99€" : $scope.defaultTitle = newValue;
				 newValue.length >= 5 ? $scope.btn1 = true : $scope.btn1 = false;
				 $scope.actualitem.title = newValue;
				 $scope.generarboton();
			 }
		 });
		
		 $scope.$watch("tmpInfocard.slogan",function(newValue,oldValue){
			 if(newValue != undefined){
				 newValue.length == 0 ? $scope.defaultSlogan = "Slogan" : $scope.defaultSlogan = newValue;
				 newValue.length >= 5 ? $scope.btn2 = true : $scope.btn2 = false;
				 $scope.actualitem.slogan = newValue;
				 $scope.generarboton();
			 }
		 });
		 
		
		$scope.$watch("actualitem.urlImg",function(newValue,oldValue){
			 newValue != oldValue ? $scope.bmImgBack = true : $scope.bmImgBack = false;
		 });
		
		 $scope.changeTypeOfActualItem = function(type){
				$scope.actualitem.type = type;
		};
		 
		
		 $scope.cargarCambios = function(){
			 var ic = new InfoCard();
			 ic.initFromCache(localStorage.getItem("MyItem"));
			 InfocardTransforms.modelToEdit(/*MODEL*/ ic, /*EDIT*/$scope.infocard);
			 $scope.actualitem.listslideimg.length > 0 ? $scope.listText = true : $scope.listText = false;
			 $scope.transformWIKItoHTML();
			 $ionicSlideBoxDelegate.update();
		 };
		 
		 $scope.transformWIKItoHTML = function()
		 {
			
			 $scope.tmpInfocard.description = Wiky.toHtml($scope.actualitem.description);
		 	 console.log($scope.tmpInfocard.description);	
		 }
		 
		 $scope.transformHTMLtoWIKI = function(){
			 	  $scope.actualitem.description = Wiky.toWiki($scope.tmpInfocard.description);
			 	  console.log($scope.actualitem.description);	
		 }
				

		 
		 $scope.guardarCambios = function(){
			 	  console.log($scope.tmpInfocard.description);
			 	  $scope.transformHTMLtoWIKI();
			 	//  $scope.transformHTMLtoWIKI();
				 //Paso1 : Recorrer arbol de items -> para construir un array de files
						var getFiles = function(/* infocard_item_edit*/ item, /* Array de files*/ fileList){
							
				 			if(item.fileImg != null) fileList.push(item.fileImg);
				 			if(item.fileIcon != null) fileList.push(item.fileIcon);
				 			console.log("------");	
				 			console.log(item);	
				 			item.listslideimg.forEach(function(obj){
				 				//TODO: Crear clase del objeto
				 				/* objeto
				 				"tipo"  : "img",
								"file"  : scope.fileUrlImg,
								"src"   : newValue,
								"cover" : null,
								"code"	: null,
								"drag" : true,
								"btndelete" : true */
				 				
				 				if(obj.file != null) fileList.push(obj.file);
				 				
				 				
				 			});
				 			
				 			if(item.type== "MENU"){
			 					item.items.forEach(function(myitem){
			 						getFiles(myitem,fileList);
			 					});
			 				}
				 		}
				 		
				 		var fileList = []; // Lista de file vacia.
						getFiles($scope.infocard, fileList);
						
				 //Paso2 : Salvar la lista de files en el servidor
						
						if(fileList.length>0){
						
							asm.uploadImages(fileList).then(function(res){
								//Paso3 : Recorrer arbol de items -> asignar las urls
								var setUrls = function(/* infocard_item_edit*/ item, urls){
						 			if(item.fileImg != null)  item.urlImg = urls[item.fileImg.name];
						 			if(item.fileIcon != null) item.urlImgIcon = urls[item.fileIcon.name];
						 			
						 			
						 			item.listslideimg.forEach(function(obj){
						 				console.log(obj);
						 				if(obj.file != null)  obj.src = urls[obj.file.name];
						 			});
						 			
					 				if(item.type== "MENU"){
					 					item.items.forEach(function(myitem){
					 						setUrls(myitem,urls)
					 					});
					 				}
						 		}
								setUrls($scope.infocard,res);
						 		//Paso 4 : salvar infocard en server
								
						 			 var info = new InfoCard();
									 info.init({});
									 InfocardTransforms.editToModel(/*EDIT*/$scope.infocard,/*MODEL*/info);
									 /*info.save().then(function(entity){
					            		 console.log(entity);
					            		 console.log(info);
									 }).done();*/
									 var json = info.json();
									 localStorage.setItem("MyItem", json);

									 console.log(json);
				             }).done();	 
		 			}else{
		 				
		 				var info = new InfoCard();
						 info.init({});
						 InfocardTransforms.editToModel(/*EDIT*/$scope.infocard,/*MODEL*/info);
						 /*info.save().then(function(entity){
		            		 console.log(entity);
		            		 console.log(info);
						 }).done();*/
						 var json = info.json();
						 localStorage.setItem("MyItem", json);
		 			}
						
			 };
}]);




























