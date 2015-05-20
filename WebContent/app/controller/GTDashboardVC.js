//var GTDashboardViewController = angular.module('GTDashboardViewController', [])
fibity.manager.app.controller('GTDashboardVC',['$scope', '$mdSidenav', '$routeParams', function($scope,$routeParams){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	
	$scope.toggleLeft = function() {
	    $mdSidenav('left').toggle()
	                      .then(function(){
	                          $log.debug("toggle left is done");
	                      });
	  };
	
	/********************************************/
	
	$scope.path = [{"name":"Panel principal", "href": "#/dashboard"}];

	$scope.title = "Panel Principal";
	$scope.activeitem = "dashboard";
	//$scope.param = $routeParams.param;
	
	$scope.barDataset = {
			labels : ["Lunes","Martes","Miércoles","Jueves","Viernes","Sabado","Domingo"],
		    datasets : [
		      {
		    	  	label: "Usuarios",
		    	  	fillColor: "rgba(0,220,97,0.2)",
		        strokeColor: "rgba(0,195,86,0.7)",
	            pointColor: "rgba(10,195,86,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
		        data : [65,59,90,81,56,55,40]
		      }
		    ]
	};
	
	$scope.lineDataset = {
		    labels : ["Lunes","Martes","Miércoles","Jueves","Viernes","Sabado","Domingo"],
		    datasets : [
		        {
		        		label: "Usuarios totales",
		            fillColor: "rgba(220,220,220,0.2)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [65, 59, 80, 81, 56, 55, 90]
		        },
		        {
		            label: "Usuarios activos",
		            fillColor: "rgba(0,220,97,0.2)",
		            strokeColor: "rgba(0,195,86,0.7)",
		            pointColor: "rgba(10,195,86,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [28, 48, 48, 58, 34, 27, 40]
		        }
		    ]
		  };
	
	$scope.pieDataset = [
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
	
	
	
	
	$scope.users = [
	             {
	               name: 'Lia Lugo',
	               avatar: 'svg-1',
	               content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
	             },
	             {
	               name: 'George Duke',
	               avatar: 'svg-2',
	               content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
	             },
	             {
	               name: 'Gener Delosreyes',
	               avatar: 'svg-3',
	               content: "Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeney's blog. Try-hard art party Shoreditch selfies. Odd Future butcher VHS, disrupt pop-up Thundercats chillwave vinyl jean shorts taxidermy master cleanse letterpress Wes Anderson mustache Helvetica. Schlitz bicycle rights chillwave irony lumbersexual Kickstarter next level sriracha typewriter Intelligentsia, migas kogi heirloom tousled. Disrupt 3 wolf moon lomo four loko. Pug mlkshk fanny pack literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS."
	             },
	             {
	               name: 'Lawrence Ray',
	               avatar: 'svg-4',
	               content: 'Scratch the furniture spit up on light gray carpet instead of adjacent linoleum so eat a plant, kill a hand pelt around the house and up and down stairs chasing phantoms run in circles, or claw drapes. Always hungry pelt around the house and up and down stairs chasing phantoms.'
	             },
	             {
	               name: 'Ernesto Urbina',
	               avatar: 'svg-5',
	               content: 'Webtwo ipsum dolor sit amet, eskobo chumby doostang bebo. Bubbli greplin stypi prezi mzinga heroku wakoopa, shopify airbnb dogster dopplr gooru jumo, reddit plickers edmodo stypi zillow etsy.'
	             },
	             {
	               name: 'Gani Ferrer',
	               avatar: 'svg-6',
	               content: "Lebowski ipsum yeah? What do you think happens when you get rad? You turn in your library card? Get a new driver's license? Stop being awesome? Dolor sit amet, consectetur adipiscing elit praesent ac magna justo pellentesque ac lectus. You don't go out and make a living dressed like that in the middle of a weekday. Quis elit blandit fringilla a ut turpis praesent felis ligula, malesuada suscipit malesuada."
	             }
	           ];
}]);


