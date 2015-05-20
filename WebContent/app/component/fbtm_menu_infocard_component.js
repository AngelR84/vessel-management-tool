fibity.manager.app.directive("menuInfocard",function($ionicSlideBoxDelegate,$timeout,$ionicSideMenuDelegate,$sce){
	var directive = {};
	
	directive.restrict = 'E';
	
	directive.templateUrl = "views/components/fbtm_menu_infocard_component.html";
	
	 directive.scope = {
			 infocard : "=",
			 actualitem : "=",
			 actualtype : "=",
			 editable : "=",
			 ocultar : "=",
			 btnhidden : "=",
			 urlok : "=",
			 description : "="
	 }

	 directive.link = function(scope, el)
	 {
		scope.actualview = [];
		scope.actualitem.type = "INFO"; 
		
		scope.fileIcon = "../../images/image.png";
		scope.actualitem.preAnt = 2.00;
		scope.preDes;
		scope.actualitem.preAct = 1.00;
		 
	 	scope.navegate = function(obj, array){
			if(array.length > 0){
				var myArray = JSON.parse(JSON.stringify(array));
				myArray.splice(0,1);
				if(obj.getItem(array[0]) != null)
					return scope.navegate(obj.getItem(array[0]),myArray);
			}else {
				return obj;
				
			}
		};
	 	scope.updateActualInfocard = function(){
			scope.actualitem = scope.navegate(scope.infocard, scope.actualview);
		};
		
		
		scope.addItemToActualInfocard = function(){
			scope.actualitem.addItem(new InfocardItem("title","slogan","<p>description</p>",scope.actualtype.info, scope.actualitem.urlImg, scope.fileIcon, scope.actualitem.urlPage,scope.actualitem.preAnt,scope.actualitem.preAct));
		}
		
		
	
		scope.actualPosition = 0;
		
		scope.goTo = function(index){
			scope.actualview.push(index);
			scope.updateActualInfocard();
			//CREO COPIA 
			
			var actualviewCopy = JSON.parse(JSON.stringify(scope.actualview));
				scope.listSlide.push(actualviewCopy);
				$ionicSlideBoxDelegate.update();
				$timeout(function(){
					$ionicSlideBoxDelegate.next();
					scope.ocultarInputFile();
				},100,true);
		};
		
		scope.goBack  = function(index){
			scope.actualview.splice(scope.actualview.length-1,1);
			scope.updateActualInfocard();
			
			$ionicSlideBoxDelegate.previous();
			$timeout(function(){
				scope.listSlide.splice(scope.listSlide.splice.length-1,1);
				$ionicSlideBoxDelegate.update();
				scope.ocultarInputFile();
			},200,true);
		};
		
		scope.ocultarInputFile = function(){
			scope.listSlide.length > 1 ? scope.ocultar = false : scope.ocultar = true;
		};
		
		scope.getItem = function(navigationArray){
			 var item = scope.navegate(scope.infocard,navigationArray);
			 return item;
		}
		
		scope.listSlide = [[]];
		
		/**
		 * funciones deordenar y borrar lista
		 */
		
		 scope.data = {
				showDelete : false, //ocultar icono de borrar
			};

			
		scope.changeButtonDeleted = function(){
			if(scope.data.showDelete == false)
				{
					scope.data.showReorder = false;
					scope.data.showDelete = true;
				}
			else{
				scope.data.showDelete = false;
			}
		};
		
		scope.changeButtonMove = function(){
			if(scope.data.showReorder == false)
				{
					scope.data.showDelete = false;
					scope.data.showReorder = true;
				}
			else{
				scope.data.showReorder = false;
			}
		};
		
		 scope.moveItem = function(item, fromIndex, toIndex) {
			  scope.actualitem.items.splice(fromIndex, 1);
			  scope.actualitem.items.splice(toIndex, 0, item);
		  };
		  
		  scope.onItemDelete = function(item) {
			  scope.actualitem.items.splice(scope.actualitem.items.indexOf(item),1);
		  };
		  
		  scope.toggleLeft = function() {
			    $ionicSideMenuDelegate.toggleLeft();
			};
			
			
		scope.$watch('actualitem.preAnt',function(newValue,oldValue){
			if(newValue) 
				scope.preDes = ((newValue - scope.actualitem.preAct) /newValue) * 100;
			    scope.preDes = Math.floor(scope.preDes);
		});
	
		
		scope.$watch('actualitem.preAct',function(newValue,oldValue){
			
			if(newValue <= scope.actualitem.preAnt)
				{
					scope.preDes = ((scope.actualitem.preAnt - newValue) /scope.actualitem.preAnt) * 100;	 
					scope.preDes = Math.floor(scope.preDes);
			}else{
				scope.actualitem.preAct = "";
			}
		});
		   
		scope.$watch('actualitem.listslideimg.length',function(newValue,oldValue){
				console.log("Actualizando Ionic");
				$ionicSlideBoxDelegate.update();
		 });
		
		
		
		
		scope.activarFocus = {};
		scope.activarFocus.title = "";
		scope.activarFocus.description = "";
		scope.activarFocus.img = "";
		
		
		scope.ocultarTitulo = function(){
			
			scope.actualitem.type == 'URL' && scope.btnhidden.titulo == false ? scope.btnhidden.url = true : scope.btnhidden.url = false;
			scope.btnhidden.titulo == false ? scope.btnhidden.titulo = true : scope.btnhidden.titulo = false;
			scope.btnhidden.titulo == true ? scope.activarFocus.title = "Infocard-miFocus-title" : scope.activarFocus.title = "";
			scope.activarFocus.img = "";
			scope.activarFocus.description = "";
			scope.btnhidden.description = false;
			scope.btnhidden.imgInfo = false;
			scope.btnhidden.precio = false;
			scope.btnhidden.listSlide = false;
			
		}
		
		scope.ocultarDescription = function(){
			scope.btnhidden.description == false ? scope.btnhidden.description = true : scope.btnhidden.description = false;
			scope.btnhidden.description == true ? scope.activarFocus.description = "Infocard-miFocus-description" : scope.activarFocus.description = "";
			scope.activarFocus.title = "";
			scope.activarFocus.img = "";
			scope.activarFocus.listSlide = "";
			scope.btnhidden.titulo = false;
			scope.btnhidden.imgInfo = false;
			scope.btnhidden.precio = false;
			scope.btnhidden.url = false;
			scope.btnhidden.listSlide = false;
		}	
		
		scope.ocultarImg = function(){
			scope.actualitem.type == 'OFFER' && scope.btnhidden.imgInfo == false ? scope.btnhidden.precio = true : scope.btnhidden.precio = false;
			scope.btnhidden.imgInfo == false ? scope.btnhidden.imgInfo = true :  scope.btnhidden.imgInfo = false;
			scope.btnhidden.imgInfo == true ? scope.activarFocus.img = "Infocard-miFocus-img" : scope.activarFocus.img = "";
			scope.activarFocus.title = "";
			scope.activarFocus.description = "";
			scope.activarFocus.listSlide = "";
			scope.btnhidden.titulo = false;
			scope.btnhidden.description = false;
			scope.btnhidden.url = false;	
			scope.btnhidden.listSlide = false;
		}		
		
		scope.ocultarListSlide = function(){
			scope.btnhidden.listSlide == false ? scope.btnhidden.listSlide = true :  scope.btnhidden.listSlide = false;
			scope.btnhidden.listSlide == true ? scope.activarFocus.listSlide = "Infocard-miFocus-listSlide" : scope.activarFocus.listSlide = "";
			scope.activarFocus.title = "";
			scope.activarFocus.description = "";
			scope.activarFocus.img = "";
			scope.btnhidden.titulo = false;
			scope.btnhidden.description = false;
			scope.btnhidden.imgInfo = false;
		}

	 }
	
	return directive;
});



























