// Create Subclass of ASMEntity
var Campaign = Class.create(ASMEntity,{
	//construct
	initialize : function($super){
		/*String*/ 
		
		/*String*/ this.pInfoCardId = "infocardId";
		/*List*/   this.pAntennasList = "antennasList";
		/*String*/ this.pName = "name";
		/*Bool*/   this.pDynamic = "dynamic";
		/*List*/   this.pSchedulesList = "scheduleList";

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

		
		Campaign.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
			var future = new asyncFuture;
			asmFuture.then(function(list){
				  
				  var result = [];
		      list.forEach(function(/*ASMEntity*/ e){
		    	  	var objCampaign = new Campaign();
		    	  	objCampaign.initFromEntity(e);
		        result.push(objCampaign);
		      });
		      future.return(result);
		});
		return future;
		};


	Campaign.entityKind = Campaign.prototype.entityKind = "campaign";
//Create Setters and Getters

	Campaign.prototype.setInfocardId = function(/*String*/ infocardId) { this.setStringForKey(infocardId,this.pInfoCardId); };
	Campaign.prototype.getInfocardId = function()  { return this.stringForKey(this.pInfoCardId); };

	Campaign.prototype.setAntennasList = function(/*List*/ antennasList) { this.setListForKey(antennasList,this.pAntennasList); };
	Campaign.prototype.getAntennasList = function()  { return this.listForKey(this.pAntennasList); };
	Campaign.prototype.addAntennasToList = function(/*String Schedule.id */ antennasId) { this.addItemToListForKey(antennasId,this.pAntennasList);};
	Campaign.prototype.removeAntennasIdInAntennasList = function(/*String Schedule.id */ antennasId) { this.removeElementInListForKey(antennasId,this.pAntennasList);};
	Campaign.prototype.removeIndexInAntennasList = function(/*int posicion */ index) { this.removeIndexInListForKey(index,this.pAntennasList);};

	Campaign.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Campaign.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Campaign.prototype.setDynamic = function(/*bool*/ dynamic) { this.setBoolForKey(dynamic,this.pDynamic); };
	Campaign.prototype.getDynamic = function()  { return this.boolForKey(this.pDynamic); };

	Campaign.prototype.setSchedulesList = function(/*List*/ schedulesList) { this.setListForKey(schedulesList,this.pSchedulesList); };
	Campaign.prototype.getSchedulesList = function()  { return this.listForKey(this.pSchedulesList); };
	Campaign.prototype.addScheduleToList = function(/*String Schedule.id */ scheduleId) { this.addItemToListForKey(scheduleId,this.pSchedulesList);};
	Campaign.prototype.removeScheduleIdInScheduleList = function(/*String Schedule.id */ scheduleId) { this.removeElementInListForKey(scheduleId,this.pSchedulesList);};
	Campaign.prototype.removeIndexInScheduleList = function(/*int posicion */ index) { this.removeIndexInListForKey(index,this.pSchedulesList);};

	
//Create Properties
	
	Campaign.prototype.infocardId = "";
	Object.defineProperty(Campaign.prototype, "infocardId", {
			set : function infocardId(v) { this.setInfocardId(v); },
		    get : function infocardId()  { return this.getInfocardId(); }
	});
	
	Campaign.prototype.dynamicMode = "";
	Object.defineProperty(Campaign.prototype, "dynamicMode", {
			set : function dynamicMode(v) { this.setDynamic(v); },
		    get : function dynamicMode()  { return this.getDynamic(); }
	});
		
		
	Campaign.prototype.antennasList = [];
	Object.defineProperty(Campaign.prototype, "antennasList", {
			set : function antennasList(v) { this.setAntennasList(v); },
		    get : function antennasList()  { return this.getAntennasList();}
	});
	
	
	Campaign.prototype.name = "";
	Object.defineProperty(Campaign.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});

	Campaign.prototype.schedulesList = [];
	Object.defineProperty(Campaign.prototype, "schedulesList", {
			set : function schedulesList(v) { this.setSchedulesList(v); },
		    get : function schedulesList()  { return this.getSchedulesList();}
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	