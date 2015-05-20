

var ASMEntity = Class.create();


ASMEntity.prototype = {
				initialize: function(){
					//config
					/*Map*/ 	  this._data 				= {};
					/*Map*/ 		this.config 				= {};
							  
					/*String*/ 		this.idKey 				= "id";
					/*String*/ 		this.kindKey 			= "kind";
					/*String*/ 		this.dataKey 			= "data";	
					/*String 		cacheableKey = "_asm_entity_cacheable",
					String 			syncableKey = "_asm_entity_syncableKey",*/
					/*String*/ 		this.cacheTimestampKey 	=  "timestamp";					
				},

//				ASMEntity : function(/*String*/ kind, /*Map*/ data){
//				
//				    this.config[this.kindKey] = kind;
//				    //this.config[cacheableKey] = true;
//				    //this.config[syncableKey] = false;
//				    this.config[this.cacheTimestampKey] = 0;
//				    this.config[this.idKey] = "";
//				    
//				    this._data = data;
//				  },
				  
				init : function(/*String*/ kind, /*Map*/ data){
					    this.config[this.kindKey] = kind;
					    this.config[this.cacheTimestampKey] = 0;
					    this.config[this.idKey] = "";
					    //this.config[cacheableKey] = true;
					    //this.config[syncableKey] = false;
					    this._data = data;
					    return this;
				  }, 
				  
				initWithId : function( /*String*/ kind, /*String*/ id, /*Map*/ data){

					    this.config[this.kindKey] = kind;
					    this.config[this.idKey] = id;
					    this.config[this.cacheTimestampKey] = 0;
					    //this.config[cacheableKey] = true;
					    //this.config[syncableKey] = false;
					    this._data = data;
					    this._data[this.idKey] = id;
					    return this;
				 },
				
				initFromCache : function ( /*String*/ json){
				      /*Map*/ var value = JSON.parse(json);  

				      this.config[this.kindKey] = value[this.kindKey];
				      this.config[this.idKey] = value[this.idKey];
				      this.config[this.cacheTimestampKey] = value[this.cacheTimestampKey];
				      //TODO:
				      
				      //this.config[cacheableKey] = value[cacheableKey];
				      //this.config[syncableKey] = value[syncableKey];

				      this._data = value[this.dataKey];
				      return this;
				      
				},
				  
				initFromEntity : function( /*AMEntity*/ entity){
						 this.initFromCache(entity.json());
				},
				    
				initFromServer : function( /*String*/ kind, /*String*/ id, /*String*/ json){
				        this._data = JSON.decode(json);
				        this.config[this.idKey] = id;
				        this.config[this.kindKey] = kind;
				        //this.config[cacheableKey] = true;
				        //this.config[syncableKey] = true;
				        return this;
				  },
				  
/*int*/ 		getCacheTimestamp : function(){
					   return this.config[this.cacheTimestampKey];
				  },
				  
/*void*/ 		updateCacheTimestamp : function(){
					    this.config[this.cacheTimestampKey] = Date.now();
				},
					  
/*String*/ 		kind : function(){
					    return this.config[this.kindKey];
				  },
					  
/*Future<Map<String,String>>*/ 
			    save : function(){
					    /*ASMFactory*/ //var  model = new ASMFactory();
					    return asm.save(this);    
				  },
					  
					  /*
					   * 
					   */	  
					  
				set id(/*String*/ id){
					  	this.config[this.idKey] = id;
					  	this._data[this.idKey] = id;
				  },
				
/*String*/ 		get id(){ 
						return this.config[this.idKey];

				  },
					  
/*String*/ 		stringForKey : function( /*String*/ key){
						//var v = this._data[key];
						//if(v == undefined ) v = "";
					    return this._data[key];
			      },
					  
/*void*/ 		setStringForKey : function(/*String*/ value, /*String*/ key){
					      this._data[key] = value;
				  },
					  
					  
/*int*/ 			intForKey : function(/*String*/ key){
					    return this._data[key];
				  },
					  
/*void*/ 		setIntForKey : function(/*int*/ value, /*String*/ key){
					      this._data[key] = value;
				  },
					  
/*double*/ 		doubleForKey : function(/*String*/ key){
					    return this._data[key];
				  },
					  
/*void*/ 		setDoubleForKey : function(/*double*/ value, /*String*/ key){
					      this._data[key] = value;
				  },
					  
/*bool*/ 		boolForKey : function(/*String*/ key){
						 return ((this._data[key] == true) || (this._data[key] == false)) ?
							  this._data[key]
						  :
							  undefined;
				  },
					  
/*void*/ 		setBoolForKey : function(/*bool*/ value, /*String*/ key){
					      if ((value == true) || (value == false))
					    	  		this._data[key] = value;
				  },
					  
/*List*/ 		listForKey : function(/*String*/ key){
							var res = this._data[key];
							if(res == undefined) res = [];
					        return res;
				  },
					  
/*void*/ 		setListForKey : function(/*List*/ value, /*String*/ key){
					      this._data[key] = value;
				  },
					  
/*void*/ 		addItemToListForKey : function(/*var*/ item, /*String*/ key){
					    if (this._data[key] == null) this._data[key] = [];
					     this._data[key].push(item);
				  },
					  
/*void*/ 		removeIndexInListForKey : function(/*int*/ index, /*String*/ key){
					     //DART: this._data[key].removeAt(index);
					     index > -1 ? this._data[key].splice(index, 1) : null;
				  },
				  
/*void*/	   removeElementInListForKey : function(/*String*/ element, /*String*/ key){
					     //DART: this._data[key].removeAt(index);
					     var index =  this._data[key].indexOf(element);
					     index > -1 ? this._data[key].splice(index, 1) : null;
				  },
					  
/*int*/ 			lengthOfListForKey : function( /*String*/ key){
					    return this._data[key].length;
				  },
					  
/*String*/ 		json : function(){
					    /* Map */  
						var obj = this.config;
						obj[this.dataKey] = this._data;
					    return JSON.stringify(obj);
				  },
				getData : function(){
					    return this._data;
				},

/*String*/ 		toString : function(){
					    return "Config: " + JSON.stringify(this.config) + " Data: " + JSON.stringify(this._data);
				  },

/*String*/ 		cacheKey : function(){
					    return this.config[this.kindKey] + ":" + this.config[this.idKey];
				  }  
};
