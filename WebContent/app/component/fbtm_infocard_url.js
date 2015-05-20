fibity.manager.app.directive("infocardUrl", function() {
	var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.template = "<input class='infocard-button-url' type='text' ng-model='urlmodel' ok='ok' placeholder='Introduce Url'>"

	 directive.scope = {
			 urlmodel: '=',
			 ok : '='	 
	 };

	 directive.link = function (scope) {
		 scope.$watch('urlmodel',function(newValue,oldValue){
			 var url_regx = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

			 if(url_regx.test(newValue))
			 	{
					 scope.ok = false;
			 	}
			 else
				 {
				 	scope.ok = true;
				 }
		 });
		 
	 };
	 return directive;
});