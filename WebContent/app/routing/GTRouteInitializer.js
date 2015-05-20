//configuración de las rutas

fibity.manager.app.config(['$routeProvider',function($routeProvider) {
	
	$routeProvider
	.when('/login', {
		templateUrl : fibity.manager.path + '/views/login.html',
		controller : 'GTLoginVC'
	}).when('/logout', {
		templateUrl : fibity.manager.path + '/views/logout.html',
		controller : 'GTLogoutVC'
	}).when('/antennas', {
			redirectTo : '/antennas/collection'
	}).when('/antennas/list', {
		templateUrl : fibity.manager.path + '/views/antennas.html',
		controller : 'GTAntennasVC'
	}).when('/antennas/collection', {
		templateUrl : fibity.manager.path + '/views/antennascollection.html',
		controller : 'GTAntennasVC'	
	}).when('/antennas/edit/:antennaId', {
		templateUrl : fibity.manager.path + '/views/antenna_edit.html',
		controller : 'GTAntennasEditVC'
	}).when('/antennas/map', {
		templateUrl : fibity.manager.path + '/views/antennasmap.html',
		controller : 'GTAntennasMapVC'		
	}).when('/billing', {
		templateUrl : fibity.manager.path + '/views/billing.html',
		controller : 'GTBillingVC'
	}).when('/config', {
		templateUrl : fibity.manager.path + '/views/config.html',
		controller : 'GTConfigVC'
	}).when('/config/organization', {
		templateUrl : fibity.manager.path + '/views/organization.html',
		controller : 'GTOrganizationsVC'
	}).when('/config/userprofile', {
		templateUrl : fibity.manager.path + '/views/user_profile.html',
		controller : 'GTUserProfileVC'
	}).when('/dashboard', {
		templateUrl : fibity.manager.path + '/views/dashboard.html',
	    controller : 'GTDashboardVC'
	}).when('/infocard', {
		redirectTo : '/infocard/collection'
	}).when('/infocard/collection', {
		templateUrl : fibity.manager.path + '/views/infocardcollection.html',
		controller : 'GTInfoCardsVC'
	}).when('/infocard/list', {
		templateUrl : fibity.manager.path + '/views/infocardlist.html',
		controller : 'GTInfoCardsVC'
	}).when('/campaigns', {
		redirectTo : '/campaigns/collection'
	}).when('/campaigns/collection', {
		templateUrl : fibity.manager.path + '/views/campaignscollection.html',
		controller : 'GTCampaignsVC'
	}).when('/campaigns/list', {
		templateUrl : fibity.manager.path + '/views/campaignslist.html',
		controller : 'GTCampaignsVC'
	}).when('/campaigns/edit/:campaignId', {
		templateUrl : fibity.manager.path + '/views/campaign_edit.html',
		controller : 'GTCampaignEditVC'
	}).when('/campaigns/new/', {
		templateUrl : fibity.manager.path + '/views/campaign_edit.html',
		controller : 'GTCampaignEditVC'
	}).when('/fidelization', {
		templateUrl : fibity.manager.path + '/views/fidelization.html',
		controller : 'GTFidelizationVC'
	}).when('/customers', {
		redirectTo : '/customers/collection'
	}).when('/customers/collection', {
		templateUrl : fibity.manager.path + '/views/customerscollectionview.html',
		controller : 'GTCustomersVC'
	}).when('/customers/list', {
		templateUrl : fibity.manager.path + '/views/customerslistview.html',
		//controller : 'mainController'
	}).when('/schedule',{
		templateUrl : fibity.manager.path + '/views/schedule.html'
	}).otherwise({
		redirectTo : '/dashboard'
	});
}]).run( function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    		if(asm.isLogin()){
    			if ( next.templateUrl == fibity.manager.path + '/views/login.html' ) {
    			          $location.path( "/" );
    			}
    		}else{
    			if ( next.templateUrl != fibity.manager.path + '/views/login.html' ) {
			          $location.path( "/login" );
			}
    		};
    });
 });
