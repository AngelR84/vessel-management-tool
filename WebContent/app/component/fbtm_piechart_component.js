fibity.manager.app.controller('pieCtrl',['$scope', function ($scope) {
	$scope.pieData = [
	                  {
	                    value: 30,
	                    color:"#F38630",
	                  },
	                  {
	                    value : 50,
	                    color : "#E0E4CC"
	                  },
	                  {
	                    value : 100,
	                    color : "#69D2E7"
	                  }
	                ];
}])
.directive('piechart',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = fibity.manager.path + '/views/components/fbtm_piechart_component.html';
	 
	 return directive;
})
