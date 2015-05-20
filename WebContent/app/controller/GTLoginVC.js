fibity.manager.app.controller('GTLoginVC',['$scope', '$http', '$route',  function($scope,$http,$route){
	$scope.errorMsg = false;
	$scope.version = fibity.manager.version;
	
    $scope.doLogin = function(){
    		$scope.errorMsg = false;
    		asm.login($scope.email, $scope.password).then(function(processOK){
    			if(processOK){
    				asm.getProfile().then(function(resp){
    					if(resp){
    						$route.reload();
    					}
    				});
    			}else{
    				console.log("usuario y constraseña incorrecta!");
    				$scope.errorMsg = true;
    			}
    			$scope.$apply();
    		}).done();
    };
    
}]);
