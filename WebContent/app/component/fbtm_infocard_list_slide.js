fibity.manager.app.directive("infocardListSlide", function($ionicSlideBoxDelegate) {
	var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = "views/components/fbtm_infocard_list_slide.html";

	 directive.scope = {
		listslideimg : "=",
		listtext : '='
	 };

	 directive.link = function (scope) {
		 
		 scope.imgproducts = "https://www.apple.com/es/retail/xanadu/images/xanadu_hero.jpg";

		 scope.txtlistinfo = true;
		 
		 scope.data = { active: false };
	     
	     scope.toggle = function () {
	       scope.data.active = !scope.data.active;
	     };
	     
	     scope.listtext == true ? scope.txtlistinfo = false : scope.txtlistinfo = true;
	     scope.btndelete = true;
	     scope.drag = true;
	     scope.youtube = {};
	     scope.youtube.fileyoutube;
	     scope.youtube.urlyotube;  
	     scope.youtube.codeyoutube;  
	     scope.youtube.coveryoutube;
	     scope.youtube.correct = true;
	     
	     
	     scope.$watch("imgproducts",function(newValue,oldValue){
	 		if(newValue != oldValue)
	 			{
		 			var infoList = new SlideModel();
		 			infoList.type = "IMG";
		 			infoList.src = newValue;
		 			scope.listslideimg.push({'type':infoList.type,'src':infoList.src, 'file': scope.fileUrlImg});
					scope.listtext == true ? scope.txtlistinfo = false : scope.txtlistinfo = true;
				 	scope.data.active = false;
	 			}
	 	});
	  
		scope.addImageUrlyoutube = function(){
			var infoList = new SlideModel();
			infoList.type = "YOUTUBE";
			infoList.src = scope.youtube.codeyoutube;
			scope.listslideimg.push({'type':infoList.type,'src':infoList.src});
			scope.youtube.urlyotube = "";
			scope.listtext == true ? scope.txtlistinfo = false : scope.txtlistinfo = true;
		 	scope.data.active = false;
		};
		
	 	
		scope.deleteImage = function(index){
			scope.listslideimg.splice(index,1);
			scope.listslideimg.length == 0 ? scope.txtlistinfo = true : scope.txtlistinfo = false;
		}
		
		scope.actualizarListSlide = function(){
			console.log("Actualizando Ionic");
			$ionicSlideBoxDelegate.update();
		}
		
		scope.goTo=function($index){
			console.log("Cambio Ionic");
			$ionicSlideBoxDelegate.slide($index);
			$ionicSlideBoxDelegate.update();
		}
	 };
	 return directive;
});












