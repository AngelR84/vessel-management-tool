fibity.manager.app = angular.module('fbtmApp',['leaflet-directive','ngMaterial','ngRoute','chartjs',"ngAnimate",'ui.calendar','ui.bootstrap','googlechart','sy.bootstrap.timepicker','template/syTimepicker/timepicker.html','template/syTimepicker/popup.html','google-maps'])
.config(function($mdThemingProvider) {
	  //$mdThemingProvider.theme('default')
	  //  .primaryPalette('green');
	  
	  var fibityTheme = $mdThemingProvider.extendPalette('green', {
		    '500': '1ecd6d',
		    	'50': 'e8faf0',
		    	'100': 'a5ebc4',
		    	'200': '78e1a7',
		    	'300': '4ad78a'
		  });
	  // Register the new color palette map with the name <code>neonRed</code>
	  $mdThemingProvider.definePalette('fibityTheme', fibityTheme);
	  // Use that theme for the primary intentions
	  $mdThemingProvider.theme('default')
		  .primaryPalette('fibityTheme');
	  
	  $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('green')
      .warnPalette('red')
      .dark();
	  
	  
	  var fibitySidenavTheme = $mdThemingProvider.extendPalette('green', {
		    
			'50': 'eaeae9',
		    	'100': 'c0c0be',
		    	'200': '969693',
		    	'300': '565652',
		    	'400': 'ef5350',
		    	'500': '2D2D28',
		    	'600': 'e53935',
		    	'700': 'd32f2f',
		    	'800': 'c62828',
		    	'900': 'b71c1c',
		    	'A100': 'ff8a80',
		    'A200': 'ff5252',
		    'A400': 'ff1744',
		    'A700': 'd50000',
		    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
            // on this palette should be dark or light
			'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
			'200', '300', '400', 'A100'],
			'contrastLightColors': undefined    // could also specify this if default was 'dark'
		  });
	  $mdThemingProvider.definePalette('fibitySidenavTheme', fibitySidenavTheme);
	  $mdThemingProvider.theme('fm-sidenav', 'default')
	  .primaryPalette('fibitySidenavTheme')
	  .backgroundPalette('fibitySidenavTheme')
      .dark();
	  


	  	 
	});
fibity.manager.api.init = function(apiRoot) {
	  var apisToLoad = 2; // must match number of calls to gapi.client.load();
	  
	  var callback = function() {
		  if (--apisToLoad == 0){
	    		console.log("API ready!");
	    		angular.element(document).ready(function() {
	    		     angular.bootstrap(document, ['fbtmApp']);
	    	    });
	    	  }
	  };
	  
	  gapi.client.load('account', 'v1beta2', callback, apiRoot);
	  gapi.client.load('manager', 'v1beta2', callback, apiRoot);
	  //gapi.client.load('dev', 'v1beta1', callback, apiRoot);
	  //gapi.client.load('oauth2', 'v2', callback);
};

var mobileHover = function () {
    jQuery('*').on('touchstart', function () {
    		jQuery(this).trigger('hover');
    }).on('touchend', function () {
    		jQuery(this).trigger('hover');
    });
};
mobileHover();