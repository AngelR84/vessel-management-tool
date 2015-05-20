var fibity = fibity || {};
fibity.manager = fibity.manager  || {};
fibity.manager.api = fibity.manager.api || {};
//fibity.manager.api.url = 'https://fibitycloud.appspot.com';
fibity.manager.api.url = 'https://1beta6-dot-fibitycloud.appspot.com';
//fibity.manager.api.url = 'http://localhost:8080';
fibity.manager.api.appId = '{{appid}}';
fibity.manager.version = '{{release}}';
fibity.manager.version != '' ? fibity.manager.path = 'release/' + fibity.manager.version : fibity.manager.path = '';

function init(){
	jQuery(document).ready(function() {
		fibity.manager.api.init(fibity.manager.api.url + "/_ah/api");
	});
}
