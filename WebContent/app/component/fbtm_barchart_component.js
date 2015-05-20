fibity.manager.app.directive('barchart', function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.template = '<cjs-bar dataset="options.dataset" autofit=true></cjs-bar>';
	 
	 directive.link = function ($scope) {
		 $scope.options = {};
		 $scope.options.dataset = {
				    labels : ["January","February","March","April","May","June","July"],
				    datasets : [
				      {
				        fillColor : "#B0F0B1",
				        strokeColor : "#04B431",
				        data : [65,59,90,81,56,55,40]
				      }
				    ]
				  };
     };
	 
	 return directive;
});
