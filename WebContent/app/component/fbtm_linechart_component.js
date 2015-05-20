fibity.manager.app.controller('lineCtrl',['$scope', function ($scope) {
	$scope.lineData = {
	    labels : ["January","February","March","April","May","June","July"],
	    datasets : [
	      {
	        fillColor : "#B0F0B1", /*fondo*/
	        strokeColor : "#178F19", /* line que une los puntos*/
	        pointColor : "#04B431", /* color del puntos */
	        pointStrokeColor : "#178F19", /* border de los puntos*/
	        data : [28,48,40,19,96,27,100]
	      }
	    ]
	  };
}])
.directive('linechart',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.template = '<div ng-controller="lineCtrl"><cjs-line dataset="lineData" autofit=true></cjs-line></div>';
	 
	 return directive;
});


