/********************	Class Infocard   ******************/

// Create Subclass of ASMEntity
var InfoCard = Class.create(ASMEntity,{
	//construct
	initialize : function($super){
		this.pUrlImg = "imgUrl";
		this.pTitle = "title";
		this.pDescription = "description";
		
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

		/*Future<List<Antenna>> */	
		InfoCard.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<Antenna>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objInfoCard = new InfoCard();
			    	  	objInfoCard.initFromEntity(e);
			        result.push(objInfoCard);
			      });
			      future.return(result);
		    });
			return future;
		 };

	InfoCard.entityKind = InfoCard.prototype.entityKind = "infocard";
	//Create Setters and Getters

	InfoCard.prototype.setUrlImg = function(/*String*/ urlImg){ this.setStringForKey(urlImg,this.pUrlImg);};
	InfoCard.prototype.getUrlImg = function(){ return this.stringForKey(this.pUrlImg); };
	
	InfoCard.prototype.setTitle = function(/*String*/ title){ this.setStringForKey(title,this.pTitle); };
	InfoCard.prototype.getTitle = function() { return this.stringForKey(this.pTitle); };
	
	InfoCard.prototype.setDescription = function(/*String*/ description){ this.setStringForKey(description,this.pDescription); };
	InfoCard.prototype.getDescription = function(){ return this.stringForKey(this.pDescription); };
	//Create Properties

	InfoCard.prototype.urlImg = "";
	Object.defineProperty(InfoCard.prototype,"urlImg",{
		set	: function urlImg(v) { this.setUrlImg(v); },
		get : function urlImg() { return this.getUrlImg(); }
	});
	
	InfoCard.prototype.title = "";
	Object.defineProperty(InfoCard.prototype,"title",{
		set : function title(v) { this.setTitle(v); },
		get : function title() { return this.getTitle(); }
	});
	
	
	InfoCard.prototype.description = "";
	Object.defineProperty(InfoCard.prototype,"description",{
		set : function description(v) { this.setDescription(v); },
		get : function description() { return this.getDescription(); }
	});

/************* End Class InfoCard **************/	
	
	
	
	
	
	
	
	
	
	
	
	
	