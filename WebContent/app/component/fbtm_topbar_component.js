
//angular.module('GTTopBarComponent', [])
fibity.manager.app.directive('fbtmTopbar', function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = fibity.manager.path + '/views/components/fbtmTopbarComponent.html',

	 directive.scope = {
			 	profile : "=",
			 	path : "="
	 };
	 
	 return directive;
});