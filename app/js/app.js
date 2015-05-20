var app = angular.module('StarterApp', ['ngRoute','ngResource','ngMaterial','uiGmapgoogle-maps','vesselServices']);

//Router Configuration
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	//Dashboard
    when('/dasboard', {
      templateUrl: 'view/dashboard.html',
      controller: 'DashboardCtrl'
    }).
    //Vessels List
    when('/vessel/list', {
        templateUrl: 'view/vessel_list.html',
        controller: 'VesselListCtrl'
    }).
    //Create new Vessel
    when('/vessel/new', {
          templateUrl: 'view/vessel_edit.html',
          controller: 'VesselItemCtrl'
    }).
    //Edit an existing Vessel by Id
    when('/vessel/edit/:vesselId', {
      templateUrl: 'view/vessel_edit.html',
      controller: 'VesselItemCtrl'
    }).
    when('/about', {
        templateUrl: 'view/about.html',
        controller: 'VesselItemCtrl'
      }).
    //Default view
    otherwise({
      redirectTo: '/dasboard'
    });                      
}]);

//Material Design Theme Color Configuration
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('pink');
});

//Main controller
app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
 
}]);

//Map controller
app.controller("DashboardCtrl", [ '$scope', '$location', 'uiGmapIsReady', 'Vessel', function($scope, $location, uiGmapIsReady, Vessel) {
	
	//Map Data
	$scope.map = {};
    $scope.map = {center: {latitude: 40, longitude: 20 }, zoom: 2, bounds: {} };
    $scope.options = {scrollwheel: false};
    $scope.control = {};

    uiGmapIsReady.promise().then(function (maps) {
        $scope.control.refresh();
    });
    
    $scope.markers = [];
    
	//Vessel List from Server
	$scope.vessels = Vessel.query( function(vesselList){
	    for(var i = 0; i< vesselList.length; i++) {
		    	 $scope.markers.push({
			      id: vesselList[i]._id,
			      coords: {
			    	  	latitude: vesselList[i].last_geo[0],
			    	  	longitude: vesselList[i].last_geo[1]
			      },
			      title: vesselList[i].name,
			      options: {
				    	  draggable: false,
				    	  labelContent: vesselList[i].name,
				    	  labelAnchor: "50 0",
				      labelClass: "marker-labels"
			      },
			      events:{
				    	  click : function(marker, eventName, args){
				    		  console.log(marker);
				    		  $location.path('/vessel/edit/' + marker.key);
				    	  }
			      }
			  });
	    }
	    $scope.$apply();
	});

	/*vessel = {name: "Vessel Name 1",
			   width: 150,
			   length: 300,
			   draft: 20,
			   last_geo: [40, 15]};
    
    $scope.vessels = Vessel.query();
    $scope.vessel1 = Vessel.get({_id:'555a4ab917c829491584f116'});
    $scope.vessel1 = Vessel.save(vessel);
    $scope.vesseldelete = Vessel.remove({_id:'1'});
    console.log($scope.vessels);*/
}]);

app.controller('VesselListCtrl',['$scope', '$location', 'Vessel', function($scope, $location, Vessel) {

	
  $scope.vessels = Vessel.query();

  $scope.goToPerson = function(person, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .content('Inspect ' + person)
        .ariaLabel('Person inspect demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
  //Open Vessel 
  $scope.openVessel = function(id) {
	  $location.path('/vessel/edit/' + id);
  };    
  // Remove Vessel Handler
  $scope.removeVessel = function(id) {
	  //Send remove request to the server
	  Vessel.remove({_id:id});
	  
	  //Finding the vessel in the vessels list.
	  for (var i = 0;i<$scope.vessels.length;i++) {
		 if($scope.vessels[i]._id == id){
			//Delete vessels from the list
			 $scope.vessels.splice (i, 1);
			 
			 //Show dialog (Optional)
			 /*$mdDialog.show(
					 $mdDialog.alert()
					 .title('Vessel Removed')
					 .content('The selected vessel had been removed')
					 .ok('Done!')
					 .targetEvent(event)
		     );*/
		 }
	  }
  };
  
  $scope.navigateTo = function(to, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .content('Imagine being taken to ' + to)
        .ariaLabel('Navigation demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };

}]);

app.controller('VesselItemCtrl',['$scope','$routeParams', '$location', 'uiGmapIsReady', 'Vessel', function($scope, $routeParams, $location, uiGmapIsReady, Vessel) {
	
	 //Map Data
	$scope.map = {};
    $scope.map = {center: {latitude: 40, longitude: -15 }, zoom: 4 };
    $scope.options = {scrollwheel: false};
    $scope.control = {};
    
    $scope.marker = {
      id: 0,
      coords: {
        latitude: 40,
        longitude: -15
      },
      options: { draggable: true, 
    	  		labelAnchor: "50 0",
            labelClass: "marker-labels"},
    };
    
    uiGmapIsReady.promise().then(function (maps) {
        $scope.control.refresh();
        //console.log(maps);
    });

    
	//Default Vessel 
    $scope.marker.options.labelContent = "New Vessel";
	$scope.vessel = {name: "New Vessel",
			   width: 50,
			   length: 100,
			   draft: 10,
			   last_geo: [40, -15]};
	
	
	$scope.edit = ($routeParams.vesselId != undefined);
	
	if($scope.edit){
		 //API access : Request Vessel
		 $scope.vessel = Vessel.get({_id:$routeParams.vesselId}, function(vessel) {
			  $scope.marker.options.labelContent = $scope.vessel.name;
			  $scope.map.center.latitude = $scope.vessel.last_geo[0];
			  $scope.map.center.longitude = $scope.vessel.last_geo[1];
			  $scope.marker.coords.latitude = $scope.vessel.last_geo[0];
			  $scope.marker.coords.longitude = $scope.vessel.last_geo[1];
			  $scope.$apply();
			 console.log(vessel);
		 });
	 }
	  
	 //Update Vessel Method
	 $scope.updateVessel = function() {
		 myVessel= {name: $scope.marker.options.labelContent,
				   width: $scope.vessel.width,
				   length: $scope.vessel.length,
				   draft: $scope.vessel.draft,
				   last_geo: [$scope.marker.coords.latitude, $scope.marker.coords.longitude]};
		 console.log(myVessel);
	     Vessel.update({_id: $scope.vessel._id}, myVessel);
	     $location.path('/vessel/list');
	  };
	  
	  //Create Vessel Method
	  $scope.createVessel = function() {
			 myVessel= {name: $scope.marker.options.labelContent,
					   width: $scope.vessel.width,
					   length: $scope.vessel.length,
					   draft: $scope.vessel.draft,
					   last_geo: [$scope.marker.coords.latitude, $scope.marker.coords.longitude]};

		     Vessel.create(myVessel);
		     $location.path('/vessel/list');
	  };
	  
	  //Remove Vessel Method
	  $scope.removeVessel = function() {
		  //Send remove request to the server
		  Vessel.remove({_id:$scope.vessel._id});
		  $location.path('/vessel/list');
	  };
}]);
