/********************	Class Antenna Activation   ******************/

// Create Subclass of ASMEntity
var AntennaActivation = Class.create(ASMEntity,{
	//construct
	initialize : function($super){
		this.pName = "name";
		this.pLocation = "location";
		this.pSection = "section";
		this.pKey = "key";

		//Call parent construct
		$super();
	},
	//initializer with data
	init : function($super,/*Map*/ data)
		{
			//Call parent init method
			$super(this.entityKind,data);
		}
});

		/*Future<List<AntennaActivation>> */	
			AntennaActivation.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
		    		var future = new asyncFuture;
		    		asmFuture.then(function(list){
		    			  /*List<AntennaActivation>*/ 
		    			  var result = [];
				      list.forEach(function(/*ASMEntity*/ e){
				    	  	var objAntennaActivation = new AntennaActivation();
				    	  	objAntennaActivation.initFromEntity(e);
				        result.push(objAntennaActivation);
				      });
				      future.return(result);
		        });
				return future;
			 };
	 
	AntennaActivation.entityKind = AntennaActivation.prototype.entityKind = "antenna_activation";
	//Create Setters and Getters
	
	AntennaActivation.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	AntennaActivation.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	AntennaActivation.prototype.setLocation = function(/*String*/ location) { this.setStringForKey(location,this.pLocation); };
	AntennaActivation.prototype.getLocation = function()  { return this.stringForKey(this.pLocation); };
	
	AntennaActivation.prototype.setSection = function(/*String*/ section) { this.setStringForKey(section,this.pSection); };
	AntennaActivation.prototype.getSection = function()  { return this.stringForKey(this.pSection); };
	
	AntennaActivation.prototype.setKey = function(/*String*/ key) { this.setStringForKey(key,this.pKey); };
	AntennaActivation.prototype.getKey = function()  { return this.stringForKey(this.pKey); };
	
	
	//Create Properties
	AntennaActivation.prototype.name = "";
	Object.defineProperty(AntennaActivation.prototype,"name",{
		set : function name(v){ this.setName(v); },
		get : function name() { return this.getName(); }
	});
	
	AntennaActivation.prototype.location = "";
	Object.defineProperty(AntennaActivation.prototype,"location",{
		set : function location(v){ this.setLocation(v); },
		get : function location() { return this.getLocation(); }
	});
	
	AntennaActivation.prototype.section = "";
	Object.defineProperty(AntennaActivation.prototype,"section",{
		set : function section(v){ this.setSection(v); },
		get : function section() { return this.getSection(); }
	});
	
	AntennaActivation.prototype.key = "";
	Object.defineProperty(AntennaActivation.prototype,"key",{
		set : function key(v){ this.setKey(v); },
		get : function key() { return this.getKey(); }
	});
/************* End Class Antenna Activation **************/	
	
	
	
	
	
	
	
	
	
	
	
	
	
	