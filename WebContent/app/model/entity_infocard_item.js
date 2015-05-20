/********************	Class InfocardItemModel Item  ******************/

// Create Subclass of ASMEntity
var InfocardItemModel = Class.create(ASMEntity,	{
	//construct
		initialize : function($super){
			this.pTitle = "title";
			this.pSlogan = "slogan";
			this.pDescription = "description";
			this.pType = "type";
			this.pUrlImg = "imgUrl";
			this.pUrlImgIcon = "urlImgIcon";
			this.pItemsList = "itemsList";
			this.pUrlPage = "urlPage";
			this.pPrice = "price";
			this.pDeal = "deal";
			this.pSlideList = "slidelist";
			
			//Variables locales
			this.fileIcon = null;
			this.imgIcon = this.fileIcon;
			
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

		/*Future<List<Infocard>> */	
		InfocardItemModel.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<Antenna>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objInfoCard = new InfocardItemModel();
			    	  	objInfoCard.initFromEntity(e);
			        result.push(objInfoCard);
			      });
			      future.return(result);
		    });
			return future;
		 };
		
		 InfocardItemModel.entityKind = InfocardItemModel.prototype.entityKind = "InfocardItemModel";
		
		 //Create Setters and Getters
		 InfocardItemModel.prototype.setTitle = function(/*String*/ title){ this.setStringForKey(title,this.pTitle); };
		 InfocardItemModel.prototype.getTitle = function() { return this.stringForKey(this.pTitle); };
			
		 InfocardItemModel.prototype.setSlogan = function(/*String*/ slogan) { this.setStringForKey(slogan,this.pSlogan); };
		 InfocardItemModel.prototype.getSlogan = function()  { return this.stringForKey(this.pSlogan); };
			
		 InfocardItemModel.prototype.setDescription = function(/*String*/ description){ this.setStringForKey(description,this.pDescription); };
		 InfocardItemModel.prototype.getDescription = function(){ return this.stringForKey(this.pDescription); };
		 
		 InfocardItemModel.prototype.setType = function(/*String*/ type){ this.setStringForKey(type,this.pType); };
		 InfocardItemModel.prototype.getType = function(){ return this.stringForKey(this.pType); };
		 
		 InfocardItemModel.prototype.setUrlImg = function(/*String*/ urlImg){ this.setStringForKey(urlImg,this.pUrlImg);};
		 InfocardItemModel.prototype.getUrlImg = function(){ return this.stringForKey(this.pUrlImg); };
		 
		 InfocardItemModel.prototype.setUrlImgIcon = function(/*String*/ urlImgIcon){ this.setStringForKey(urlImgIcon,this.pUrlImgIcon);};
		 InfocardItemModel.prototype.getUrlImgIcon = function(){ return this.stringForKey(this.pUrlImgIcon); };
				
		 InfocardItemModel.prototype.setSlideList = function(/*List<SlideModel>*/ slideList) { 
			 this.setListForKey([],this.pSlideList); 
			 slideList.forEach(function(slide){
				 this.addSlideToList(slide);
			 });
		 };
		 
		 InfocardItemModel.prototype.getSlideList = function()  { 
			//Lista de objetos
			 var list = this.listForKey(this.pSlideList);
			 var resultList = [];
			 list.forEach(function(slide){
				 var obj = new SlideModel();
				 obj.initFromCache(slide);
				 resultList.push(obj);
			 });
			 return resultList; 
		 };
		 
		 InfocardItemModel.prototype.addSlideToList = function(/* SlideModel */ slide) {		
			 this.addItemToListForKey(slide.json(),this.pSlideList);
		  };
		 
		 InfocardItemModel.prototype.setItemsList = function(/*List*/ itemsList) { 
			 itemsList = new InfocardItemModel();
			 this.setListForKey([],this.pItemsList); 
			 
			 itemsList.forEach(function(item){
				 this.addItemsToList(item);
			 });
		 };
		 
		 InfocardItemModel.prototype.getItemsList = function()  { 
			//Lista de objetos
			 var list = this.listForKey(this.pItemsList);
			 var result = [];
			 list.forEach(function(item){
				 var obj = new InfocardItemModel();
				 obj.initFromCache(item);
				 result.push(obj);
			 });

			 return result; 
		 };
		 
		 InfocardItemModel.prototype.addItemToList = function(/* InfocardItemModel */ item) {
			// var objList = new InfocardItemModel();
			 this.addItemToListForKey(item.json(),this.pItemsList);
		  };
			
		 InfocardItemModel.prototype.setUrlPage = function(/*String*/ urlPage){ this.setStringForKey(urlPage,this.pUrlPage);};
		 InfocardItemModel.prototype.getUrlPage= function(){ return this.stringForKey(this.pUrlPage); };
		 
		 InfocardItemModel.prototype.setPrice = function(/*String*/ price){ this.setStringForKey(price,this.pPrice); };
		 InfocardItemModel.prototype.getPrice = function(){ return this.stringForKey(this.pPrice); };
		 
		 InfocardItemModel.prototype.setDeal = function(/*String*/ deal){ this.setStringForKey(deal,this.pDeal);};
		 InfocardItemModel.prototype.getDeal = function(){ return this.stringForKey(this.pDeal); };
		 
		//Create Properties
			
			InfocardItemModel.prototype.title = "";
			Object.defineProperty(InfocardItemModel.prototype,"title",{
				set : function title(v) { this.setTitle(v); },
				get : function title() { return this.getTitle(); }
			});
			
			InfocardItemModel.prototype.slogan = "";
			Object.defineProperty(InfocardItemModel.prototype, "slogan", {
					set : function slogan(v) { this.setSlogan(v); },
				    get : function slogan()  { return this.getSlogan(); }
			});
			
			InfocardItemModel.prototype.description = "";
			Object.defineProperty(InfocardItemModel.prototype,"description",{
				set : function description(v) { this.setDescription(v); },
				get : function description() { return this.getDescription(); }
			});
			
			InfocardItemModel.prototype.type = "";
			Object.defineProperty(InfocardItemModel.prototype,"type",{
				set	: function type(v) { this.setType(v); },
				get : function type() { return this.getType(); }
			});
			
			InfocardItemModel.prototype.urlImg = "";
			Object.defineProperty(InfocardItemModel.prototype,"urlImg",{
				set	: function urlImg(v) { this.setUrlImg(v); },
				get : function urlImg() { return this.getUrlImg(); }
			});			
			
			InfocardItemModel.prototype.urlImgIcon = "";
			Object.defineProperty(InfocardItemModel.prototype,"urlImgIcon",{
				set	: function urlImgIcon(v) { this.setUrlImgIcon(v); },
				get : function urlImgIcon() { return this.getUrlImgIcon(); }
			});		
			
			InfocardItemModel.prototype.itemsList = [];
			Object.defineProperty(InfocardItemModel.prototype, "itemsList", {
					set : function itemsList(v) { this.setItemsList(v); },
				    get : function itemsList()  { return this.getItemsList();}
			});
			
			InfocardItemModel.prototype.slideList = [];
			Object.defineProperty(InfocardItemModel.prototype, "slideList", {
					set : function slideList(v) { this.setSlideList(v); },
				    get : function slideList()  { return this.getSlideList();}
			});
			
			InfocardItemModel.prototype.urlPage = "";
			Object.defineProperty(InfocardItemModel.prototype,"urlPage",{
				set	: function urlPage(v) { this.setUrlPage(v); },
				get : function urlPage() { return this.getUrlPage(); }
			});
			
			InfocardItemModel.prototype.price = "";
			Object.defineProperty(InfocardItemModel.prototype,"price",{
				set : function price(v) { this.setPrice(v); },
				get : function price() { return this.getPrice(); }
			});
			
			InfocardItemModel.prototype.deal = "";
			Object.defineProperty(InfocardItemModel.prototype, "deal", {
					set : function deal(v) { this.setDeal(v); },
				    get : function deal()  { return this.getDeal(); }
			});
			
/************* End Class InfocardItemModel **************/	
			
