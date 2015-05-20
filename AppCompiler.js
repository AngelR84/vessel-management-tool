var release = "v1.0.12";
var appid = "6F7DE3DAF0CF42C7B67BF7BD74F998B6";

var buildify = require('buildify');
var minify = require('html-minifier').minify;
var fs = require('node-fs-extra');

//JS
function js(isRelease){
	var files= [
	           //JS Libs
	           //'./WebContent/scripts/angular.min.js',
	           //'./WebContent/scripts/angular-route.min.js',
	           //'./WebContent/scripts/prototype.js',
	           //'./WebContent/scripts/chart-0.2.0.js',
	           //'./WebContent/scripts/angular-charts.js',
	           //'./WebContent/scripts/fileReaderUpload.js',
	           
	           //App
	           './WebContent/app/app.js',
	           
	           //Script JS
	           //'./WebContent/scripts/ui-bootstrap.min.js',
	           './WebContent/scripts/ui-bootstrap-tpls-0.11.0.min.js',
	           
	           //'./WebContent/scripts/angular-charts.js',
	           './WebContent/scripts/fileReaderUpload.js',
	           //'./WebContent/scripts/angular-animate.js',
	           './WebContent/scripts/position.js',
	           './WebContent/scripts/timepicker.js',
	           './WebContent/scripts/timepicker-tpl.js',
	           './WebContent/scripts/dialogs.min.js',
	           './WebContent/scripts/ng-google-chart.js',
	           
	           //Utilities
	           
	           './WebContent/app/util/event_validator.js',
	           
	           //Routing
	           './WebContent/app/routing/GTRouteInitializer.js',
	           
	           //Services
	           
	          './WebContent/app/service/auto_sync_model/asm_entity.js',
	 	      './WebContent/app/service/auto_sync_model/asm_factory.js',
	 	      
	 	      './WebContent/app/model/entity_antenna.js',
	 	      './WebContent/app/model/entity_antenna_activation.js',
	 	      './WebContent/app/model/entity_billing.js',
	 	      './WebContent/app/model/entity_campaign.js',
	 	      './WebContent/app/model/entity_customers.js',
	 	      './WebContent/app/model/entity_infocard.js',
	 	      './WebContent/app/model/entity_organization.js',
	 	      './WebContent/app/model/entity_schedule.js',
	 	      
	 	      './WebContent/app/model/init_model.js',
	           
	           './WebContent/app/service/file_reader/file_reader_upload.js',
	           

	           //Directives 
	           './WebContent/app/directive/ngfocus.js',
	           
	           
	           //Componentes / Directives
	           './WebContent/app/component/fbtm_chart_component.js',
	           './WebContent/app/component/fbtm_topbar_component.js',
	           './WebContent/app/component/fbtm_sidebar_component.js',
	           './WebContent/app/component/fbtm_donutchart_component.js',
	           './WebContent/app/component/fbtm_input_file_loader.js',
	           './WebContent/app/component/fbtm_google_places.js',
	           
	           //Controllers
	           './WebContent/app/controller/GTLoginVC.js',
	           './WebContent/app/controller/GTLogoutVC.js',
	           
	           './WebContent/app/controller/GTDashboardVC.js',
	           
	           './WebContent/app/controller/GTAntennasVC.js',
	           './WebContent/app/controller/GTAntennasMapVC.js',
	           './WebContent/app/controller/GTAntennasEditVC.js',
	           
	           './WebContent/app/controller/GTBillingVC.js',
	           './WebContent/app/controller/GTBillingAddModal.js',
	           
	           './WebContent/app/controller/GTFidelizationVC.js',
	           
	           './WebContent/app/controller/GTConfigVC.js',
	           
	           './WebContent/app/controller/GTOrganizationsVC.js',
	           './WebContent/app/controller/GTUserProfileVC.js',
	           
	           './WebContent/app/controller/GTInfoCardsVC.js',
	           './WebContent/app/controller/GTInfoCardsAddModalVC.js',
	           
	           './WebContent/app/controller/GTCampaignsVC.js',
	           './WebContent/app/controller/GTCampaignsEditVC.js',
	           './WebContent/app/controller/GTCampaignsAddModalVC.js',
	           
	           './WebContent/app/controller/GTCustomersVC.js'

	           
	           
	  ];
	
	 if(isRelease){
		 buildify()
		  .concat(files)
		  .annotate()
		  .uglify({except: ['$super','fibity']})
		  .save('./WebContent/build/release/'+release+'/app/app.min.js');
		 
		 buildify()
		  .load('./WebContent/app/config_template.js')
		  .perform(function(content) {
			  var result = content.replace(/{{release}}/g, release);
			  return result.replace(/{{appid}}/g, appid);
		  })
		  .uglify()
		  .save('./WebContent/build/release/'+release+'/app/config.js');
		 
	 }else{
		 buildify()
		  .concat(files)
		  .save('./WebContent/app/app.min.js');
		 
		 buildify()
		  .load('./WebContent/app/config_template.js')
		  .perform(function(content) {
			  var result = content.replace(/{{release}}/g,"");
			  return result.replace(/{{appid}}/g, appid);
		  })
		  .save('./WebContent/app/config.js');
	 }
}

//CSS

function css(isRelease){
	var files = [
	         './WebContent/css/bootstrap.min.css',
	         //'./WebContent/css/bootstrap-theme.min.css',
	         //'./WebContent/css/ui-bootstrap.css',
	         //'./WebContent/css/color.css',
	         './WebContent/css/fullcalendar.min.css',
	         //'./WebContent/css/angular-slider.css',
	         //'./WebContent/css/calendar.css',
	         './WebContent/css/leaflet.css',
	         './WebContent/css/dashboard.css',
	         './WebContent/css/buttons.css',
	         './WebContent/css/timeline.css'
	         
	];
	
	if(isRelease){
		buildify()
		.concat(files)
		.cssmin()
		.save('./WebContent/build/release/'+release+'/app/app.min.css');
	}else{
		buildify()
		.concat(files)
		.save('./WebContent/app/app.min.css');
	}
}

// HTML minify
function createRelease(){
	
	// index.html
	buildify()
	.load('./WebContent/index_template.html') 
	.perform(function(content) {
        return content.replace(/{{release}}/g, 'release/' + release);
     })
     .htmlmin()
	 .save('./WebContent/build/index.html');
	
	
	//views
	var htmlFiles = [//Views
	                 
	                 'antenna_edit.html',
	                 'antennas.html',
	                 'antennascollection.html',
	                 'antennasmap.html',
	                 'billing.html',
	                 'billingEdit.html',
	                 'campaign_edit.html',
	                 'campaignscollection.html',
	                 'campaignslist.html',
	                 'config.html',
	                 'customerscollectionview.html',
	                 'customerslistview.html',
	                 'dashboard.html',
	                 'fidelization.html',
	                 'form.html',
	                 'infocardlist.html',
	                 'infocardcollection.html',
	                 'infocards_modal_add.html',
	                 'login.html',
	                 'logout.html',
	                 'organization.html',
	                 
	                 //Components
	                 'components/fbtm_barchart_component.html',
	                 'components/fbtm_input_file_loader.html',
	                 'components/fbtm_linechart_component.html',
	                 'components/fbtm_piechart_component.html',
	                 'components/fbtm_switch_component.html',
	                 'components/fbtmSidebarComponent.html',
	                 'components/fbtmTopbarComponent.html'];
	htmlFiles.forEach(function(file){
		buildify()
		.load('./WebContent/views/' + file) 
		.htmlmin()
		.save('./WebContent/build/release/'+release+'/views/' + file);
	});
	
	//JavaScript
	js(true);
	
	//Css
	css(true);
	
	//Images
	fs.copy('./WebContent/images', './WebContent/build/release/' +  release + '/images', function (err) {
		  if (err) console.error(err);
	});
	
	//Fonts
	fs.copy('./WebContent/fonts', './WebContent/build/release/' +  release + '/fonts', function (err) {
		  if (err) console.error(err);
	});
	
	//Scripts
	fs.copy('./WebContent/scripts', './WebContent/build/release/' +  release + '/scripts', function (err) {
		  if (err) console.error(err);
	});
	
}

//Start Server
var express = require('express');
var app = express();

/*
app.use(function(req, res, next){
	 if(req.path == '/libs/app.css' || req.path == '/libs/app.min.css') css(false);
	 if(req.path == 'libs/app.js' || req.path == '/libs/app.min.js') js(false);
	 //if(req.path == '/') html();
	  next();
	});
*/
app.use(express.static(__dirname + '/WebContent'));



app.get("/", function(req,resp){
	const minifyOptions = {removeComments: true,
            removeCommentsFromCDATA: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: false,
            removeOptionalTags: true,
            removeEmptyElements: false
	 };
	css(false);
	js(false);
	
	 resp.writeHead(200, {"Content-Type":"text/html"});
	 fs.readFile("./WebContent/index_template.html", "utf8", function (err, data) {
	        if (err) throw err;
	        var result  = data.replace(/{{release}}/g, "");
	        resp.write(minify(result,minifyOptions));
	        resp.end();
	 });
});

app.get("/create_release", function(req,resp){
	
	 createRelease();

	 resp.writeHead(200, {"Content-Type":"text/html"});
	 resp.write('<html><body><a href="/build/index.html">Release ' + release +  '</a><script>window.location.href = "/build/";</script></body></html>');

	 resp.end();
	 
});

app.listen(3000);
console.log("Server Running on port 3000");
