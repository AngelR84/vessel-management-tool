fibity.manager.app.directive("infocardImgYoutube", function() {
	var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.template = "<input class='infocard-button-url' type='text' ng-model='imgmodel' fileyoutube='fileyoutube' placeholder='Introduce Url de video'>";

	 directive.scope = {
			 permissions: '@',
			 imgmodel : '=',
			 codeyoutube: '=',
		     correct:'=',
		     fileyoutube : "="
	 };

	 directive.link = function (scope) {
		 scope.$watch('imgmodel',function(newValue,oldValue){
			 var url_regx = /^http:\/\/(?:www\.)?youtube.com\/watch\?(?=[^?]*v=\w+)(?:[^\s?]+)?$/;
			   
			 if(url_regx.test(newValue))
			 	{
					 var cad1 = newValue.split('&');
					 var cad2 = cad1[0].split('http://www.youtube.com/watch?v=');
					 var sep = cad2[1].split(',');
					 scope.codeyoutube = sep[0];
					 scope.correct = false;
			 	}
			 else
				 {
				 	scope.correct = true;
				 }
		 });
		 
	 };
	 return directive;
});