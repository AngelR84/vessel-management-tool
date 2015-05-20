
/*************** Class Organization ***************/


//Create Subclass  of ASMEntity
var Organization =  Class.create(ASMEntity,{

	//Constructor
	initialize : function($super) {

		/*String*/ this.pUrlImgLogo = "urlImgLogo";
		/*String*/ this.pUrlImgBackground = "urlImgBackground";
		/*String*/ this.pName = "name";
		/*String*/ this.pSlogan = "slogan";
		/*String*/ this.pDescription = "description";
		
		/*String*/ this.pSocialWeb = "socialWeb";
		/*String*/ this.pSocialFacebook = "socialFacebook";
		/*String*/ this.pSocialTwitter = "socialTwitter";
		/*String*/ this.pSocialLinkedin = "socialLinkedin";
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	},
	
	//initializer with id
	initWithId : function ($super, /*String*/ kind, /*String*/ id, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,id,data);	
	},
	initFromEntity : function($super, entity){
		$super(entity);
	}
	
});

		/*Future<List<Antenna>> */	
		Organization.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<Antenna>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objOrganization = new InfoCard();
			    	  	objOrganization.initFromEntity(e);
			        result.push(objOrganization);
			      });
			      future.return(result);
		    });
			return future;
		 };

	Organization.entityKind = Organization.prototype.entityKind = "organization";
	//Create Setters and Getters

	Organization.prototype.setUrlImgLogo = function(/*String*/ urlImgLogo){ this.setStringForKey(urlImgLogo,this.pUrlImgLogo); };
	Organization.prototype.getUrlImgLogo = function() { return this.stringForKey(this.pUrlImgLogo); };

	Organization.prototype.setUrlImgBackground = function(/*String*/ urlImgBackground) { this.setStringForKey(urlImgBackground,this.pUrlImgBackground); };
	Organization.prototype.getUrlImgBackground = function()  { return this.stringForKey(this.pUrlImgBackground); };

	Organization.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Organization.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Organization.prototype.setSlogan = function(/*String*/ slogan) { this.setStringForKey(slogan,this.pSlogan); };
	Organization.prototype.getSlogan = function()  { return this.stringForKey(this.pSlogan); };
	
	Organization.prototype.setDescription = function(/*String*/ description) { this.setStringForKey(description,this.pDescription); };
	Organization.prototype.getDescription = function()  { return this.stringForKey(this.pDescription); };
	
	Organization.prototype.setSocialWeb = function(/*String*/ description) { this.setStringForKey(description,this.pSocialWeb); };
	Organization.prototype.getSocialWeb = function()  { return this.stringForKey(this.pSocialWeb); };

	Organization.prototype.setSocialFacebook = function(/*String*/ description) { this.setStringForKey(description,this.pSocialFacebook); };
	Organization.prototype.getSocialFacebook = function()  { return this.stringForKey(this.pSocialFacebook); };

	Organization.prototype.setSocialTwitter = function(/*String*/ description) { this.setStringForKey(description,this.pSocialTwitter); };
	Organization.prototype.getSocialTwitter = function()  { return this.stringForKey(this.pSocialTwitter); };

	Organization.prototype.setSocialLinkedin = function(/*String*/ description) { this.setStringForKey(description,this.pSocialLinkedin); };
	Organization.prototype.getSocialLinkedin = function()  { return this.stringForKey(this.pSocialLinkedin); };

	//Create Properties
	
	Organization.prototype.urlImgLogo = "";
	Object.defineProperty(Organization.prototype, "urlImgLogo", {
			set : function urlImgLogo(v) { this.setUrlImgLogo(v); },
		    get : function urlImgLogo()  { return this.getUrlImgLogo(); }
	});
		
	Organization.prototype.urlImgBackground = "";
	Object.defineProperty(Organization.prototype, "urlImgBackground", {
			set : function urlImgBackground(v) { this.setUrlImgBackground(v); },
		    get : function urlImgBackground()  { return this.getUrlImgBackground(); }
	});
	
	Organization.prototype.name = "";
	Object.defineProperty(Organization.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Organization.prototype.slogan = "";
	Object.defineProperty(Organization.prototype, "slogan", {
			set : function slogan(v) { this.setSlogan(v); },
		    get : function slogan()  { return this.getSlogan(); }
	});
	
	Organization.prototype.description = "";
	Object.defineProperty(Organization.prototype, "description", {
			set : function description(v) { this.setDescription(v); },
		    get : function description()  { return this.getDescription(); }
	});
	
	Organization.prototype.socialWeb = "";
	Object.defineProperty(Organization.prototype, "socialWeb", {
			set : function description(v) { this.setSocialWeb(v); },
		    get : function description()  { return this.getSocialWeb(); }
	});
	
	Organization.prototype.socialFacebook = "";
	Object.defineProperty(Organization.prototype, "socialFacebook", {
			set : function description(v) { this.setSocialFacebook(v); },
		    get : function description()  { return this.getSocialFacebook(); }
	});
	
	Organization.prototype.socialTwitter = "";
	Object.defineProperty(Organization.prototype, "socialTwitter", {
			set : function description(v) { this.setSocialTwitter(v); },
		    get : function description()  { return this.getSocialTwitter(); }
	});
	
	Organization.prototype.socialLinkedin = "";
	Object.defineProperty(Organization.prototype, "socialLinkedin", {
			set : function description(v) { this.setSocialLinkedin(v); },
		    get : function description()  { return this.getSocialLinkedin(); }
	});
	
/*************** End Class Organization ***************/


