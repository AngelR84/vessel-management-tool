
fibity.manager.app.directive('swicthFibity',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = fibity.manager.path + '/views/components/fbtm_switch_component.html';
	 directive.scope = {
			 profile : "=profile"
	 };

	 return directive;
});

