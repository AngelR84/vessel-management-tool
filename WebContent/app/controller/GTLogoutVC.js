fibity.manager.app.controller('GTLogoutVC',['$scope', '$http', '$route',  function($scope,$http,$route){
		console.log("logout");
    		asm.logout().then(function(){
    			$route.reload();
    		}).done();
    		
}]);
