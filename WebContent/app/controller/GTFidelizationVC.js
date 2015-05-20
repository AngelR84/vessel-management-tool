fibity.manager.app.controller('GTFidelizationVC',['$scope', '$routeParams',  function($scope,$routeParams){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
		$scope.profile.photo = "http://m.c.lnkd.licdn.com/mpr/pub/image-yd8VUbYiXzMmEdHGM8w4sgFPpV2SXr3-yr8pDbmep6cSPk_cyd8pahvipykAPUzHvRsK/%C3%A1ngel-rivas-casado.jpg";
		
	});
	
	$scope.path = [{"name":"Fidelización", "href": "#/fidelization"}, {"name":"Gestor de puntos", "href": "#/points_manager"}];
	$scope.activeitem = "fidelization";
	/********************************************/

}]);