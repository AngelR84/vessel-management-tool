fibity.manager.app.directive('fbtmSidebar',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = fibity.manager.path + '/views/components/fbtmSidebarComponent.html',

	 // atributos de la directiva <fbtmSidebar activeitem="atributo"></fbtmSidebar>
	 directive.scope = {
			 	active : "=activeitem"
	 };

	 directive.link = function (scope) {
		 scope.options = [{"id": "dashboard" ,"title": "Panel principal", "cssclass" : "glyphicon glyphicon-dashboard "},
		                  {"id": "antennas", "title": "Antenas", "cssclass" : "glyphicon glyphicon-map-marker"},
		                  {"id": "infocard", "title": "Contenido", "cssclass" : "glyphicon glyphicon-picture"},
		                  {"id": "campaigns", "title": "Campañas", "cssclass" : "glyphicon glyphicon-calendar"},
		                  {"id": "fidelization", "title": "Fidelización", "cssclass" : "glyphicon glyphicon-credit-card"},
		                  {"id": "config", "title": "Opciones", "cssclass" : "glyphicon glyphicon-cog"}
		                 ];
		 scope.version = fibity.manager.version;
     };
     
	 return directive;
});