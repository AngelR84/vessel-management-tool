fibity.manager.app.controller('GTConfigVC',['$scope','$window',function($scope,$window){

	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	$scope.path = [{"name":"Opciones", "href": "#/organization"}];
	/*Atributo*/ $scope.activeitem = "config";
	/********************************************/

	$scope.open = function(url){
		$window.location.href = "#/config/" + url;
	};
}]);




















