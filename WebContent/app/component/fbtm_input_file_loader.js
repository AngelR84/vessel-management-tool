fibity.manager.app.directive('fbtmInputFileLoader',['fileReader', function(fileReader) {
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = fibity.manager.path + '/views/components/fbtm_input_file_loader.html';

	 // atributos de la directiva <fbtmInputFileLoader imgmodel="modelo"></fbtmSidebar>
	 directive.scope = {
			 imgmodel : "=imgmodel",
			 file : "=file"
			// maxheight : "=maxheight";
	 		// ratio : "=ratio";
	 };

	 directive.link = function (scope, el) {
		 scope.only = false;
		 el.bind("change", function(e){
		        scope.file = (e.srcElement || e.target).files[0];
		        fileReader.readAsDataUrl(scope.file, scope)
		        .then(function(result) {
		            scope.imgmodel = result;
		        });
		  });
     };
	 return directive;
}]);