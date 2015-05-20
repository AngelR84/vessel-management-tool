angular.module("MyTextAngular", ['textAngular'])
.config(function($provide){
	// this demonstrates how to register a new tool and add it to the default toolbar
	$provide.decorator('taOptions', ['$delegate', function(taOptions){ // $delegate is the taOptions we are decorating
		taOptions.toolbar = [['h1', 'p','ul']];
		
		taOptions.classes = {
                focussed: 'focussed',
                toolbar: 'btn-toolbar',
                toolbarGroup: 'btn-group',
                toolbarButton: 'btn btn-default',
                toolbarButtonActive: 'active',
                disabled: 'disabled',
                textEditor: 'form-control',
                htmlEditor: 'form-control'
            };
		return taOptions;
	}]);
	// this demonstrates changing the classes of the icons for the tools for font-awesome v3.x
	
	$provide.decorator('taTools', ['$delegate', function(taTools){
		taTools.h1.iconclass = 'glyphicon glyphicon-font';
		taTools.h1.buttontext = 'Título';
		taTools.ul.iconclass = 'glyphicon glyphicon-list';
		taTools.ul.buttontext = 'Lista';
		taTools.p.iconclass = 'glyphicon glyphicon-align-justify';
		taTools.p.buttontext = 'Párrafo';
		
		return taTools;
	}]);
	

});