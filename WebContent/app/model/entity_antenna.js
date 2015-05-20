
/*************** Class Antenna ***************/


//Create Subclass  of ASMEntity
var Antenna =  Class.create(ASMEntity,{
	//Constructor
	initialize : function($super) {
		
		this.pName = "name";
		this.pSerialNumber = "serial";
		this.pLocation = "location";
		this.pSection = "section";
		this.pFloor = "floor";
		this.pFlor = "flor";
		this.pSchedulesList = "schedule_list";
		
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	},
	initFromEntity : function($super, entity){
		$super(entity);
	}
	});
		/*Future<List<Antenna>> */	
		    Antenna.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
		    		var future = new asyncFuture;
		    		asmFuture.then(function(list){
		    			  /*List<Antenna>*/ 
		    			  var result = [];
				      list.forEach(function(/*ASMEntity*/ e){
				    	  	var objAntenna = new Antenna();
				    	  	objAntenna.initFromEntity(e);
				        result.push(objAntenna);
				      });
				      future.return(result);
		        });
				return future;
			 };

	Antenna.entityKind = Antenna.prototype.entityKind = "antenna";
	//Create Setters and Getters

	Antenna.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Antenna.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
					 //Serial is Read only
	Antenna.prototype.getSerialNumber = function()  { return this.stringForKey(this.pSerialNumber); };
	
	Antenna.prototype.setLocation = function(/*String*/ location) { this.setStringForKey(location,this.pLocation); };
	Antenna.prototype.getLocation = function()  { return this.stringForKey(this.pLocation); };
	
	Antenna.prototype.setSection = function(/*String*/ section){ this.setStringForKey(section,this.pSection); };
	Antenna.prototype.getSection = function() { return this.stringForKey(this.pSection); };
	
	Antenna.prototype.setSchedulesList = function(/*List*/ schedulesList) { this.setListForKey(schedulesList,this.pSchedulesList); };
	Antenna.prototype.getSchedulesList = function()  { return this.listForKey(this.pSchedulesList); };
	
	Antenna.prototype.addScheduleToList = function(/*String Schedule.id */ scheduleId) { this.addItemToListForKey(scheduleId,this.pSchedulesList);};
	Antenna.prototype.removeScheduleIdInScheduleList = function(/*String Schedule.id */ scheduleId) { this.removeElementInListForKey(scheduleId,this.pSchedulesList);};
	Antenna.prototype.removeIndexInScheduleList = function(/*int posicion */ index) { this.removeIndexInListForKey(index,this.pSchedulesList);};

	
	//Create Properties
	
	Antenna.prototype.name = "";
	Object.defineProperty(Antenna.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
		
	Antenna.prototype.serialNumber = "";
	Object.defineProperty(Antenna.prototype, "serialNumber", {
		    get : function serialNumber()  { return this.getSerialNumber(); }
	});
	
	Antenna.prototype.location = "";
	Object.defineProperty(Antenna.prototype, "location", {
			set : function location(v) { this.setLocation(v); },
		    get : function location()  { return this.getLocation(); }
	});
		
	Antenna.prototype.section = "";
	Object.defineProperty(Antenna.prototype, "section", {
			set : function section(v) { this.setSection(v); },
		    get : function section()  { return this.getSection(); }
	});
	
	Antenna.prototype.schedulesList = [];
	Object.defineProperty(Antenna.prototype, "schedulesList", {
			set : function schedulesList(v) { this.setSchedulesList(v); },
		    get : function schedulesList()  { return this.getSchedulesList();}
	});
	
/*************** End Class Antenna ***************/

