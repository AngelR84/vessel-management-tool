

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
					      return this._data[key];
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


const ASM_NO_EXPIRATION = 99999999999;

var ASMFactory =  Class.create();

ASMFactory.prototype = {
		initialize: function(){
/*int*/ 				this.cacheExpiredTime 	= ASM_NO_EXPIRATION;
/*String*/			this.serverUrl 			= "";
/*String*/ 			this.authAppId 			= "";
/*String*/			this.authAppKey 			= "";  
/*String*/ 			this.authToken 			= "";
/*String*/ 			this.cacheExpirationTimeKey 	= "expirationtime";
					this.cacheTimestampKey 	= "timestamp";
/*String*/ 			this.cacheableKey 		= "cacheable";
/*String*/ 			this.syncableKey 		= "syncableKey";
					this.profileKey 			= "profile";
					this.deviceIdKey 		= "deviceid";
					this.tokenKey 			= "token";
/*Map*/ 				this.kinds 				= {};

					this.currentOrganization = "7000001";
					this.appId = fibity.manager.api.appId;
					
					//Si hay token -> consultar token

					//Si no hay token -> login

					//Recuperar el token

					//recuperar la lista de organizaciones

					//seleccionar la primera org como predeterminada.

					//

			

		},
		
					initAPI: function(){
						gapi.client.load('dev', 'v1beta1', function() {
							  console.log("API Ready!");
						}, this.serverUrl + "/_ah/api/");
					},
					
/*Boolean */ 		isLogin: function(){
		 	  			return (this.getToken() != undefined);
		 	  		},
		 	  		
		 	  		setToken: function(token){
		 	  			if(token == undefined){
		 	  				localStorage.removeItem(this.tokenKey);
		 	  				localStorage.removeItem(this.profileKey);
		 	  			}else localStorage[this.tokenKey] = token;
		 	  		},
		 	  		
		 	  		getToken: function(){
		 	  			return localStorage[this.tokenKey];
		 	  		},
		 	  		
/*String*/		 	getDeviceId: function(){
		 	  			if(localStorage[this.deviceIdKey] == undefined)
		 	  				localStorage[this.deviceIdKey] = uuid.v4();
		 	  			return localStorage[this.deviceIdKey];
		 	  		},
		 	  		
/*Future<Boolean> */	login: function(email, password){
						var future = new asyncFuture();
						request = {
								"email":email,
								"password":password,
								"deviceId": this.getDeviceId(),
								"appId": this.appId
						};
						
		 	  			gapi.client.account.login(request).execute(function(resp){
		 	  				if(!resp.error){
		 	  					asm.setToken(resp.token);
		 	  					future.return(true);
		 	  				}else{
		 	  					//asm.testCredentials(resp.error);
		 	  					future.return(false);
		 	  				}
		 	  			});
		 	  			return future;
		 	  		},
		 	  		
		 	  		logout: function(){
						var future = new asyncFuture();
		 	  			request = {
								"token": this.getToken(),
								"deviceId": this.getDeviceId()
						};
		 	  			gapi.client.account.logout(request).execute(function(resp){
		 	  				
		 	  				var deviceId = localStorage["deviceid"];
		 	  				localStorage.clear();
		 	  				localStorage["deviceid"] =  deviceId;
		 	  				location.reload();
		 	  				
		 	  				/*asm.setToken(undefined);
		 	  				if(resp){
		 	  					future.return(true);
		 	  				}else{
		 	  					future.return(false);
		 	  				}*/
		 	  			});
		 	  			return future;
		 	  		},
		 	  		
		 	  		setProfile: function(profile){
		 	  			if(profile == undefined)
		 	  				localStorage.removeItem(this.profileKey);
		 	  			else localStorage[this.profileKey] = JSON.stringify(profile);
		 	  		},
		 	  		
		 	  		
/*future<profile>*/  getProfile: function(){
		 	  			var future = new asyncFuture();
		 	  			if(localStorage[this.profileKey] == undefined){
							request = {
									"deviceId": this.getDeviceId(),
									"token": this.getToken()
							};
							
			 	  			gapi.client.account.getProfile(request).execute(function(resp){
			 	  				if(!resp.error){
			 	  					asm.setProfile(resp.result);
			 	  					future.return(resp.result);
			 	  				}else{
			 	  					asm.testCredentials(resp.error);
			 	  				}
			 	  			});
		 	  			}else{
		 	  				future.return(JSON.parse(localStorage[asm.profileKey]));
		 	  			}
		 	  			return future;
		 	  		},
		 	  		
		 	  		getCurrentOrganizationId: function(){
		 	  			return this.currentOrganization;
		 	  		},
		 	  		

/*void*/ 			setServerUrl : function ( /*String*/ url){
		 	     		this.serverUrl = url;  
		 	   		},

/*void*/ 			setExpiredTime : function( /*int*/ cache_expired_time){
						this.cacheExpiredTime = cache_expired_time;
		 	   		},
	   
/*void*/ 			setServerAuthentication : function( /*String*/ appId, /*String*/ appKey,/*String*/ Token){
						this.authAppId = appId;
						this.authAppKey = appKey;
						this.authToken = Token;
		 	   		},

/*
* Config Class
*/
/*void*/ 			configKind : function(/*String*/ kind, /*bool*/ syncable, /*bool*/ cacheable,  /*int*/ cache_expired_time){
		 		  		var obj = {};
		 		  		obj[this.syncableKey] = syncable;
		 		  		obj[this.cacheableKey] = cacheable;
		 		  		obj[this.cacheTimestampKey] = 0;
		 		  		obj[this.cacheExpirationTimeKey] = cache_expired_time;
						this.kinds[kind] = obj;
		 	  		},	
		 	  		
		 	  		

		 	  		
		 	  	  /*
		 	  	   * Search a entity by Id
		 	  	   */
/*Future<ASMEntity>*/ 
		 	  	    getEntityOfKindById : function(/*String*/ kind, /*String*/ id){

			 	  	    var future = new asyncFuture();
		  /*ASMEntity*/ var result = null;
		     /*String*/ value = localStorage[kind + ":" + id];
			 	  	    if(value != null){
			 	  	    		result = new ASMEntity();
			 	  	    		result.initFromCache(value);
			 	  	      	future.return(result);
			 	  	    }else{
			 	  	    		var request = { "deviceId": asm.getDeviceId(), "token": asm.getToken() };
			 	  	    		request.id = id;
			 	  			gapi.client.manager[kind].get(request).execute(function(data){
			 	  				if(data.error == undefined){
			 	  						result = new ASMEntity();
			 	  						result.initWithId(kind,data.id,data.result);
			 	  						asm._insertInCache(result);
			 	  						future.return(result);
			 	  				}else{
			 	  					asm.testCredentials(data.error);
			 	  					future.return(null);
			 	  				}
			 	  			});
			 	  	    	
			 	  	    	
			 	  	    }
			 	  	    return future;
		 	  	    },
		 	  	  
		 	  	  
/*Future<List<ASMEntity>>*/ 
		 	  	   getAllEntitiesOfKind: function(/*String*/ kind){
		 	  	    
	/*ASMEntity*/       var entity;
	/*List<ASMEntity>*/ var result =[];
			 	  	    var future = new asyncFuture();
			 	  	    
						var expiration = this.kinds[kind][this.cacheExpirationTimeKey];
						var timestamp = this.kinds[kind][this.cacheTimestampKey];
						var actualTimestamp = new Date().getTime();
						
						if(actualTimestamp < (timestamp + expiration)){
							 for (var key in localStorage){
					 	  	       if (key.indexOf(kind + ":")!=-1){
					 	  	         entity = new ASMEntity();
					 	  	         entity.initFromCache(localStorage[key]);
					 	  	         result.push(entity);
					 	  	       } 
					 	  	    }
					 	  	    future.return(result);
						}else{
							var request = { "deviceId": asm.getDeviceId(), "token": asm.getToken() };
							
							if(["antenna","schedule","infocard","campaign"].indexOf(kind) > -1 ) request.organizationId = asm.getCurrentOrganizationId();
							
			 	  			gapi.client.manager[kind].getAll(request).execute(function(resp){
			 	  				console.log("objetos: " + kind);
			 	  				console.log(resp.items);
			 	  				if(!resp.error){
			 	  					if(resp.items != undefined){
				 	  					resp.items.forEach(function(obj){
				 	  						console.log(obj);
				 	  						entity = new ASMEntity();
				 	  						entity.initWithId(kind,obj.id,obj);
				 	  						asm._insertInCache(entity);
				 	  						result.push(entity);
				 	  					});
			 	  					}
			 	  					asm.kinds[kind][this.cacheTimestampKey] = new Date().getTime();
			 	  					future.return(result);
			 	  				}else{
			 	  					asm.testCredentials(resp.error);
			 	  					future.return(null);
			 	  				}
			 	  			});
							
							
						}
			 	  	    return future;
		 	  	  },
		 	  	  
/*void*/ 		  removeAllEntitiesOfKind : function (/*String*/ kind){
					for (var key in localStorage){
		 	  	       if (key.indexOf(kind + ":")!=-1){
		 	  	         localStorage.removeItem(key);
		 	  	       }
		 	  	    }
		 	  	  },
		 	  		
/*Future<Map<String,String>>*/ 
		 	  	  save : function(/*ASMEntity*/ entity){
		 	  			var future = new asyncFuture();
			 	  	    
			    /*Map*/ var kindconfig = this.kinds[entity.kind()];
			 	  	    
			 	  	    if(kindconfig != null){
			 	  	    
			 	  	        if(kindconfig[this.syncableKey]){
			 	  	          /*//Enviar al servidor 
			 	  	          
			 	  	          // si es cacheable -> salvar en cache
			 	  	          var url = "http://fibitycloud.appspot.com/1/user/session_status";
			 	  	                    //var url = "http://127.0.0.1:8888/1/user/session_status";
			 	  	                    
			 	  	          var request = new HttpRequest();
			 	  	          request.open('GET', url);
			 	  	          request.setRequestHeader("Content-type", "application/json");
			 	  	          request.setRequestHeader("X-Fibity-App-ID", authAppId);
			 	  	          request.setRequestHeader("X-Fibity-App-Key", authAppKey);
			 	  	          request.setRequestHeader("X-Fibity-Authentication", authToken);
			 	  	          request.onLoad.listen( (event){
			 	  	            
			 	  	              String myRes = event.target.responseText;
			 	  	              Map obj = JSON.decode(myRes);
			 	  	              
			 	  	              //entity.updateFromMap(obj);
			 	  	                        
			 	  	           });
			 	  	           request.send();
			 	  	          
			 	  	          */
			 	  	    
			 	  	        var request = {};
			 	  	        request.auth = { "deviceId": asm.getDeviceId(), "token" : asm.getToken()};
			 	  	        request[	entity.kind()] = entity.getData();
								
			 	  	        	if(["schedule","campaign","infocard"].indexOf(entity.kind()) > -1 ) request.organizationId = asm.getCurrentOrganizationId();
							var self = this;
			 	  	        	gapi.client.manager[entity.kind()].save(request).execute(function(data){
				 	  				if(!data.error){
				 	  				    entity.id = data.response.id;
			 	  	                    	self._insertInCache(entity);
			 	  	                    future.return("Entity saved!");
				 	  				}else{
				 	  					asm.testCredentials(data.error);
				 	  					future.throw({"message":"Entity didn't save!"});
				 	  				}
				 	  			});
			 	  	          
			 	  	        }else{
			 	  	              if(kindconfig[this.cacheableKey] ){
			 	  	                    if(entity.id == ""){
			 	  	                      // DART: Uuid uuid = new Uuid();
			 	  	                      entity.id = uuid.v4();
			 	  	                    }
			 	  	                    this._insertInCache(entity);
			 	  	                 future.return("Entity saved!"); //Todo OK
			 	  	                    
			 	  	              }else{
			 	  	                    print("Auto Sync Model: Entity didn't save!");
			 	  	                 future.throw({"message":"Entity didn't save!"});
			 	  	              }
			 	  	        }
			 	  	    }else{
			 	  	        //DART: print("Auto Sync Model: kind " + entity.kind() +" no configured!");
			 	  	        future.throw({"message":"Kind " + entity.kind() +" no configured!"});
			 	  	    }
			 	  	    
			 	  	      return future;
		 	  	  },
		 	  	  
/*void*/ 		  _insertInCache : function(/*ASMEntity*/ entity){
		 	  	        //Actualizar _insert_timestamp
		 	  	     entity.updateCacheTimestamp();
		 	  	        //Almacenar en Local Storage
		 	  	     localStorage[entity.cacheKey()] = entity.json();
		 	  	  },

		 				  /*
		 				   * Create a new entity
		 				   */
/*ASMEntity*/ 		newEntityOfKind	: function( /*String*/ kind, /*Map*/ data){
		 				    if(kinds[kind] != null){
		 				      return new ASMEntity(kind, data);
		 				    }else{
		 				      print("Auto Sync Model: kind " + kind +" no configured!");
		 				      return null;
		 				    }
		 			},
/*Future<Map<String,String>>*/ 
		 			uploadImages: function(/*List<File>*/ files) {
		 			    var future = new asyncFuture;
		 			    
		 			    request = new XMLHttpRequest();
		 			    //request.open('POST', "http://api.fibity.com/1/storage/image",true);
		 			   request.open('POST', "https://1beta1-dot-fibitycloud.appspot.com/storage/v1beta1/image/",true);
		 			    //request.setRequestHeader("X-Fibity-App-ID", authAppId);
		 			    //request.setRequestHeader("X-Fibity-App-Key", authAppKey);
		 			    //request.setRequestHeader("X-Fibity-Authentication", authToken);
		 			    //request.setRequestHeader("X-Fibity-Org-ID", "34f34fasdfass43qfasedf434fsasdf3");
		 			    //request.setRequestHeader("Content-type", "multipart/form-data; charset=UFT-8");
		 			    
		 			    request.onreadystatechange = function(){
		 			      /*String*/ var myRes = request.responseText;
		 			      if (request.status == 200) {
		 			        
		 			        //print("Json: " + myRes);
		 			        var res = JSON.parse(myRes);
		 			        console.log(myRes);
		 			       future.return(res);
		 			      }else if (request.status != 200){
		 			    	 future.throw("Error uploading images");
		 			      }
		 			    };
		 			    
		 			    //Add files
		 			    var formData = new FormData();
		 			    files.forEach(function(/*File*/ f){
		 			      formData.append('file', f);
		 			    });
		 			    
		 			    //formData.append('tag', tag);
		 			    request.send(formData);

		 			    return future;
		 			  },
		 			
		 			uploadImagesSync: function(/*List<File>*/ files) {
		 			    var future = new asyncFuture();
		 			    
		 			    request = new XMLHttpRequest();
		 			    request.open('POST', "https://1beta1-dot-fibitycloud.appspot.com/storage/v1beta1/image/",false);
		 			    
		 			    //request.setRequestHeader("X-Fibity-App-ID", authAppId);
		 			    //request.setRequestHeader("X-Fibity-App-Key", authAppKey);
		 			    //request.setRequestHeader("X-Fibity-Authentication", authToken);
		 			    //request.setRequestHeader("X-Fibity-Org-ID", "34f34fasdfass43qfasedf434fsasdf3");
		 			    //request.setRequestHeader("Content-type", "multipart/form-data; charset=UFT-8");

		 			    //Add files
		 			    var formData = new FormData();
		 			    files.forEach(function(/*File*/ f){
		 			      formData.append('file', f);
		 			    });
		 			    
		 			    //formData.append('tag', tag);
		 			   request.send(formData);
		 			   var myRes = request.responseText;
		 			   console.log(myRes);
		 			      if (request.readyState == 4 && request.status == 200) {
		 			        
		 			        //print("Json: " + myRes);
		 			        var res = JSON.parse(myRes);
		 			        
		 			        future.return(res);
		 			      }else{
		 			    	  	future.throw("Error uploading images");
		 			      }

		 			    return future;
		 			  },
		 			  
		 			  testCredentials: function(error){
		 				  if(error.code == 401){
		 					 var deviceId = localStorage["deviceid"];
		 					 localStorage.clear();
		 					 localStorage["deviceid"] =  deviceId;
		 					 console.log(error.message);
		 					 //location.reload();
		 					 //document.getElementById("fbtm-security").style.display="block";
		 					jQuery( "#fbtm-security" ).fadeIn(200);
		 				  }
		 			  }
		 			  
};

var asm = new ASMFactory();

//angular.module('fbtmApp.services', []).factory('ASMFactory', ['$http', ASMFactoryFunction]);
 

 
 

/*************** Class Antenna ***************/


//Create Subclass  of ASMEntity
var Antenna =  Class.create(ASMEntity,{
	//Constructor
	initialize : function($super) {
		
		this.pName = "name";
		this.pSerialNumber = "serial";
		this.pLocation = "location";
		this.pSection = "section";
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	

/*************** Class Billing ***************/


//Create Subclass  of ASMEntity
var Billing =  Class.create(ASMEntity,{

	//Constructor
	initialize : function($super) {
		/*String*/ this.pRazonSocial = "razonSocial";
		/*String*/ this.pCIF = "cif";
		
		/*String*/ this.pName = "name";
		/*String*/ this.pApellido = "apellido";
		/*String*/ this.pDni = "dni";
		 
		/*String*/ this.pDireccion1 = "direccion1";
		/*String*/ this.pDireccion2 = "direccion2";
		/*String*/ this.pPoblacion = "poblacion";
		/*String*/ this.pCodigoPostal = "codigo_postal";
		/*String*/ this.pProvincia = "provincia";
		/*String*/ this.pTelefono = "telefono";
		
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

		/*Future<List<Billing>> */	
			Billing.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<AntennaActivation>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objBilling = new Billing();
			    	  	objBilling.initFromEntity(e);
			        result.push(objBilling);
			      });
			      future.return(result);
		    });
			return future;
		 };
			
	Billing.entityKind = Billing.prototype.entityKind = "billing";
	//Create Setters and Getters

	Billing.prototype.setRazonSocial = function(/*String*/ razonSocial) { this.setStringForKey(razonSocial,this.pRazonSocial); };
	Billing.prototype.getRazonSocial = function()  { return this.stringForKey(this.pRazonSocial); };
	
	Billing.prototype.setCIF = function(/*String*/ cif) { this.setStringForKey(cif,this.pCIF); };
	Billing.prototype.getCIF = function()  { return this.stringForKey(this.pCIF); };
	
	Billing.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Billing.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Billing.prototype.setApellido = function(/*String*/ apellido) { this.setStringForKey(apellido,this.pApellido); };
	Billing.prototype.getApellido = function()  { return this.stringForKey(this.pApellido); };
	
	Billing.prototype.setDni = function(/*String*/ dni) { this.setStringForKey(dni,this.pDni); };
	Billing.prototype.getDni = function()  { return this.stringForKey(this.pDni); };
	
	Billing.prototype.setDireccion1 = function(/*String*/ direccion1){ this.setStringForKey(direccion1,this.pDireccion1); };
	Billing.prototype.getDireccion1 = function() { return this.stringForKey(this.pDireccion1); };
	
	Billing.prototype.setDireccion2 = function(/*String*/ direccion2){ this.setStringForKey(direccion2,this.pDireccion2); };
	Billing.prototype.getDireccion2 = function() { return this.stringForKey(this.pDireccion2); };
	
	Billing.prototype.setPoblacion = function(/*String*/ poblacion) { this.setStringForKey(poblacion,this.pPoblacion); };
	Billing.prototype.getPoblacion = function()  { return this.stringForKey(this.pPoblacion); };
	
	Billing.prototype.setCodigoPostal = function(/*String*/ codigoPostal){ this.setStringForKey(codigoPostal,this.pCodigoPostal); };
	Billing.prototype.getCodigoPostal = function() { return this.stringForKey(this.pCodigoPostal); };
	
	Billing.prototype.setProvincia = function(/*String*/ provincia) { this.setStringForKey(provincia,this.pProvincia); };
	Billing.prototype.getProvincia = function()  { return this.stringForKey(this.pProvincia); };
	
	Billing.prototype.setTelefono = function(/*String*/ telefono) { this.setStringForKey(telefono,this.pTelefono); };
	Billing.prototype.getTelefono = function()  { return this.stringForKey(this.pTelefono); };
	
	
	//Create Properties
	
	Billing.prototype.razonSocial = "";
	Object.defineProperty(Billing.prototype, "razonSocial", {
			set : function razonSocial(v) { this.setRazonSocial(v); },
		    get : function razonSocial()  { return this.getRazonSocial(); }
	});
		
	Billing.prototype.cif = "";
	Object.defineProperty(Billing.prototype, "cif", {
			set : function cif(v) { this.setCIF(v); },
		    get : function cif()  { return this.getCIF(); }
	});
		
	Billing.prototype.name = "";
	Object.defineProperty(Billing.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Billing.prototype.apellido = "";
	Object.defineProperty(Billing.prototype, "apellido", {
			set : function apellido(v) { this.setApellido(v); },
		    get : function apellido()  { return this.getApellido(); }
	});

	Billing.prototype.dni = "";
	Object.defineProperty(Billing.prototype, "dni", {
			set : function dni(v) { this.setDni(v); },
		    get : function dni()  { return this.getDni(); }
	});
	
	Billing.prototype.direccion1 = "";
	Object.defineProperty(Billing.prototype, "direccion1", {
			set : function direccion1(v) { this.setDireccion1(v); },
		    get : function direccion1()  { return this.getDireccion1(); }
	});
	
	Billing.prototype.direccion2 = "";
	Object.defineProperty(Billing.prototype, "direccion2", {
			set : function direccion2(v) { this.setDireccion2(v); },
		    get : function direccion2()  { return this.getDireccion2(); }
	});
	
	Billing.prototype.poblacion = "";
	Object.defineProperty(Billing.prototype, "poblacion", {
			set : function poblacion(v) { this.setPoblacion(v); },
		    get : function poblacion()  { return this.getPoblacion(); }
	});
	
	Billing.prototype.codigoPostal = "";
	Object.defineProperty(Billing.prototype, "codigoPostal", {
			set : function codigoPostal(v) { this.setCodigoPostal(v); },
		    get : function codigoPostal()  { return this.getCodigoPostal(); }
	});
	
	Billing.prototype.provincia = "";
	Object.defineProperty(Billing.prototype, "provincia", {
			set : function provincia(v) { this.setProvincia(v); },
		    get : function provincia()  { return this.getProvincia(); }
	});
		
	Billing.prototype.telefono = "";
	Object.defineProperty(Billing.prototype, "telefono", {
			set : function telefono(v) { this.setTelefono(v); },
		    get : function telefono()  { return this.getTelefono(); }
	});
	
/*************** End Class Billing ***************/


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
	
	Campaign.prototype.serialNumber = "";
	Object.defineProperty(Campaign.prototype, "serialNumber", {
		    get : function serialNumber()  { return this.getSerialNumber(); }
	});
	
	Campaign.prototype.location = "";
	Object.defineProperty(Campaign.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Campaign.prototype.location = "";
	Object.defineProperty(Campaign.prototype, "location", {
			set : function location(v) { this.setLocation(v); },
		    get : function location()  { return this.getLocation(); }
	});
		
	Campaign.prototype.section = "";
	Object.defineProperty(Campaign.prototype, "section", {
			set : function section(v) { this.setSection(v); },
		    get : function section()  { return this.getSection(); }
	});

	Campaign.prototype.schedulesList = [];
	Object.defineProperty(Campaign.prototype, "schedulesList", {
			set : function schedulesList(v) { this.setSchedulesList(v); },
		    get : function schedulesList()  { return this.getSchedulesList();}
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

/*************** Class Customers ***************/


//Create Subclass  of ASMEntity
var Customers =  Class.create(ASMEntity,{

	//Constructor
	initialize : function($super) {
		
		/*String*/ this.pName = "name";
		/*String*/ this.pApellido = "apellido";
		/*String*/ this.pFoto = "foto";
		/*String*/ this.pPuntos = "puntos";
		/*String*/ this.pLastVisita = "lastVisita";
		
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	}
	
});

		/*Future<List<Customers> */	
		Customers.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
			var future = new asyncFuture;
			asmFuture.then(function(list){
				  /*List<Customers>*/ 
				  var result = [];
		      list.forEach(function(/*ASMEntity*/ e){
		    	  	var objCustomers = new Customers();
		    	  	objCustomers.initFromEntity(e);
		        result.push(objCustomers);
		      });
		      future.return(result);
		});
		return future;
		};


	Customers.entityKind = Customers.prototype.entityKind = "customers";
	//Create Setters and Getters
	
	Customers.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Customers.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Customers.prototype.setApellido = function(/*String*/ apellido) { this.setStringForKey(apellido,this.pApellido); };
	Customers.prototype.getApellido = function()  { return this.stringForKey(this.pApellido); };
	
	Customers.prototype.setFoto = function(/*String*/ foto) { this.setStringForKey(foto,this.pFoto); };
	Customers.prototype.getFoto = function()  { return this.stringForKey(this.pFoto); };
	
	Customers.prototype.setPuntos = function(/*int*/ puntos){ this.setIntForKey(puntos,this.pPuntos); };
	Customers.prototype.getPuntos = function() { return this.intForKey(this.pPuntos); };
	
	Customers.prototype.setLastVisita = function(/*String*/ lastVisita) { this.setStringForKey(lastVisita,this.pLastVisita); };
	Customers.prototype.getLastVisita = function()  { return this.stringForKey(this.pLastVisita); };
	
	//Create Properties
	
	Customers.prototype.name = "";
	Object.defineProperty(Customers.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Customers.prototype.apellido = "";
	Object.defineProperty(Customers.prototype, "apellido", {
			set : function apellido(v) { this.setApellido(v); },
		    get : function apellido()  { return this.getApellido(); }
	});
	
	Customers.prototype.foto = "";
	Object.defineProperty(Customers.prototype, "foto", {
			set : function foto(v) { this.setFoto(v); },
		    get : function foto()  { return this.getFoto(); }
	});
	
	Customers.prototype.puntos = "";
	Object.defineProperty(Customers.prototype, "puntos", {
			set : function puntos(v) { this.setPuntos(v); },
		    get : function puntos()  { return this.getPuntos(); }
	});
		
	Customers.prototype.lastVisita = "";
	Object.defineProperty(Customers.prototype, "lastVisita", {
			set : function lastVisita(v) { this.setLastVisita(v); },
		    get : function lastVisita()  { return this.getLastVisita(); }
	});
	
/*************** End Class Customers ***************/



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
	
	
/*************** End Class Organization ***************/



/*************** Class Schedule ***************/
//Create Subclass  of ASMEntity
var Schedule =  Class.create(ASMEntity,{
	//Constructor
	initialize : function($super) {
		
		/* FECHAS Y HORAS */
		/*String*/ this.pDateIni = "dateIni";
		/*String*/ this.pDateEnd = "dateEnd";
		/*String*/ this.pHourIni = "hourEni";
		/*String*/ this.pHourEnd = "hourEnd";
		/*String*/ this.pName = "name";
		
		/* ID DE INFOCARD Y LISTADO DE ANTENAS */
		/*String*/ this.pIdinfocard = "Idinfocard";
		/*String*/ this.pMaxUser = "maxUser";
		/*String*/ this.pAntennasList = "antennasList";
		
		/* REPETICION */
		/*String*/ this.pRepetition   = "repetition";
		/*String*/ this.pEveryDaily   = "every_daily";
		/*String*/ this.pEveryWeekly  = "every_weekly";
		/*String*/ this.pEveryMonthly = "every_monthly";
		/*String*/ this.pEveryYearly  = "every_yearly";
		/*String*/ this.pEveryExactlySelection = "every_exactly_selection";
		/*String*/ this.pEveryExactlyDay = "every_exactly_day";
		/*String*/ this.pEvery = "allDay"; 
		
		/* END && STATIC */
		/*String*/ this.pEnd = "end";
		/*String*/ this.pStatico = "statico";

		/* DIA DEL 1 AL 31 */
		
		/*String*/ this.pDay1 = "Day1";
		/*String*/ this.pDay2 = "Day2";
		/*String*/ this.pDay3 = "Day3";
		/*String*/ this.pDay4 = "Day4";
		/*String*/ this.pDay5 = "Day5";
		/*String*/ this.pDay6 = "Day6";
		/*String*/ this.pDay7 = "Day7";
		/*String*/ this.pDay8 = "Day8";
		/*String*/ this.pDay9 = "Day9";
		/*String*/ this.pDay10 = "Day10";
		/*String*/ this.pDay11 = "Day11";
		/*String*/ this.pDay12 = "Day12";
		/*String*/ this.pDay13 = "Day13";
		/*String*/ this.pDay14 = "Day14";
		/*String*/ this.pDay15 = "Day15";
		/*String*/ this.pDay16 = "Day16";
		/*String*/ this.pDay17 = "Day17";
		/*String*/ this.pDay18 = "Day18";
		/*String*/ this.pDay19 = "Day19";
		/*String*/ this.pDay20 = "Day20";
		/*String*/ this.pDay21 = "Day21";
		/*String*/ this.pDay22 = "Day22";
		/*String*/ this.pDay23 = "Day23";
		/*String*/ this.pDay24 = "Day24";
		/*String*/ this.pDay25 = "Day25";
		/*String*/ this.pDay26 = "Day26";
		/*String*/ this.pDay27 = "Day27";
		/*String*/ this.pDay28 = "Day28";
		/*String*/ this.pDay29 = "Day29";
		/*String*/ this.pDay30 = "Day30";
		/*String*/ this.pDay31 = "Day31";	
		
		/*DIAS DE LA SEMANA */
	   
		/*String*/ this.pMonday = "monday";
		/*String*/ this.pTuesday = "tuesday";
		/*String*/ this.pWednesday = "wednesday";
		/*String*/ this.pThursday = "thursday";
		/*String*/ this.pFriday = "friday";
		/*String*/ this.pSaturday = "saturday";
		/*String*/ this.pSunday = "sunday";
	    
	    /* MESES DEL ANYO */
		/*String*/ this.pJanuary = "january";
		/*String*/ this.pFebruary = "february";
		/*String*/ this.pMarch = "march";
		/*String*/ this.pApril = "april";
		/*String*/ this.pMay = "may";
		/*String*/ this.pJune = "june";
		/*String*/ this.pJuly = "july";
		/*String*/ this.pAugust = "august";
		/*String*/ this.pSeptember = "september";
		/*String*/ this.pOctober = "october";
		/*String*/ this.pNovember = "november";
		/*String*/ this.pDecember = "december";
	    
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	}
	
});

		/*Future<List<Antenna>> */	
		Schedule.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<Antenna>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objSchedule = new InfoCard();
			    	  	objSchedule.initFromEntity(e);
			        result.push(objSchedule);
			      });
			      future.return(result);
		    });
			return future;
		 };

	Schedule.entityKind = Schedule.prototype.entityKind = "schedule";
	//Create Setters and Getters

	Schedule.prototype.setDateIni = function(/*String*/ dateIni){ this.setStringForKey(dateIni,this.pDateIni);};
	Schedule.prototype.getDateIni = function(){ return this.stringForKey(this.pDateIni); };
	
	Schedule.prototype.setDateEnd = function(/*String*/ dateEnd){ this.setStringForKey(dateEnd,this.pDateEnd);};
	Schedule.prototype.getDateEnd = function(){ return this.stringForKey(this.pDateEnd);};

	Schedule.prototype.setHourIni = function(/*String*/ hourIni){ this.setStringForKey(hourIni,this.pHourIni);};
	Schedule.prototype.getHourIni = function(){ return this.stringForKey(this.pHourIni); };
	
	Schedule.prototype.setHourEnd = function(/*String*/ hourEnd){ this.setStringForKey(hourEnd,this.pHourEnd);};
	Schedule.prototype.getHourEnd = function(){ return this.stringForKey(this.pHourEnd);};
	
	Schedule.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Schedule.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Schedule.prototype.setIdinfocard = function(/*String*/ Idinfocard){ this.setStringForKey(Idinfocard,this.pIdinfocard);};
	Schedule.prototype.getIdinfocard = function(){ return this.stringForKey(this.pIdinfocard);};
	
	Schedule.prototype.setMaxUser = function(/*int*/ maxUser){ this.setIntForKey(maxUser,this.pMaxUser);};
	Schedule.prototype.getMaxUser = function(){ return this.intForKey(this.pMaxUser);};
	
	Schedule.prototype.setAntennasList = function(/*List*/ AntennasList) { this.setListForKey(AntennasList,this.pAntennasList); };
	Schedule.prototype.getAntennasList = function()  { return this.listForKey(this.pAntennasList); };
	Schedule.prototype.addAntennasToList = function(/*String Schedule.id */ AntennasId) { this.addItemToListForKey(AntennasId,this.pAntennasList);};
	Schedule.prototype.removeAntennasIdInAntennasList = function(/*String Schedule.id */ AntennasId) { this.removeElementInListForKey(AntennasId,this.pAntennasList);};
	Schedule.prototype.removeIndexInAntennasList = function(/*int posicion */ index) { this.removeIndexInListForKey(index,this.pAntennasList);};
	
	/* REPETICION */
	Schedule.prototype.setRepetition = function(/*int*/ repetition){this.setIntForKey(repetition,this.pRepetition);};
	Schedule.prototype.getRepetition = function(){ return this.intForKey(this.pRepetition);};
	
	Schedule.prototype.setEveryDaily = function(/*int*/ everyDaily){this.setIntForKey(everyDaily,this.pEveryDaily);};
	Schedule.prototype.getEveryDaily = function(){ return this.intForKey(this.pEveryDaily);};
	
	Schedule.prototype.setEveryWeekly = function(/*int*/ everyWeekly){this.setIntForKey(everyWeekly,this.pEveryWeekly);};
	Schedule.prototype.getEveryWeekly = function(){ return this.intForKey(this.pEveryWeekly);};
	
	Schedule.prototype.setEveryMonthly = function(/*int*/ everyMonthly){this.setIntForKey(everyMonthly,this.pEveryMonthly);};
	Schedule.prototype.getEveryMonthly = function(){ return this.intForKey(this.pEveryMonthly);};
	
	Schedule.prototype.setEveryYearly = function(/*int*/ everyYearly){this.setIntForKey(everyYearly,this.pEveryYearly);};
	Schedule.prototype.getEveryYearly = function(){ return this.intForKey(this.pEveryYearly);};
	
	Schedule.prototype.setEveryExactlySelection = function(/*int*/ everyExactlySelection){this.setIntForKey(everyExactlySelection,this.pEveryExactlySelection);};
	Schedule.prototype.getEveryExactlySelection = function(){ return this.intForKey(this.pEveryExactlySelection);};
	
	Schedule.prototype.setEveryExactlyDay = function(/*int*/ everyExactlyDay){this.setIntForKey(everyExactlyDay,this.pEveryExactlyDay);};
	Schedule.prototype.getEveryExactlyDay = function(){ return this.intForKey(this.pEveryExactlyDay);};
	
	Schedule.prototype.setEvery = function(/*int*/ every){this.setIntForKey(every,this.pEvery);};
	Schedule.prototype.getEvery = function(){ return this.intForKey(this.pEvery);};
	/**	FIN **/
	
	/*** END && STATIC ***/
	Schedule.prototype.setEnd = function(/*int*/ end){this.setIntForKey(end,this.pEnd);};
	Schedule.prototype.getEnd = function(){ return this.intForKey(this.pEnd);};
	
	Schedule.prototype.setStatico = function(/*bool*/ statico){this.setBoolForKey(statico,this.pStatico);};
	Schedule.prototype.getStatico = function(){ return this.boolForKey(this.pStatico);};
	
	
	/*********DIAS**********/
	
	Schedule.prototype.setDay1 = function(/*bool*/ day1){this.setBoolForKey(day1,this.pDay1);};
	Schedule.prototype.getDay1 = function(){ return this.boolForKey(this.pDay1);};
	
	Schedule.prototype.setDay2 = function(/*bool*/ day2){this.setBoolForKey(day2,this.pDay2);};
	Schedule.prototype.getDay2 = function(){ return this.boolForKey(this.pDay2);};
	
	Schedule.prototype.setDay3 = function(/*bool*/ day3){this.setBoolForKey(day3,this.pDay3);};
	Schedule.prototype.getDay3 = function(){ return this.boolForKey(this.pDay3);};
	
	Schedule.prototype.setDay4 = function(/*bool*/ day4){this.setBoolForKey(day4,this.pDay4);};
	Schedule.prototype.getDay4 = function(){ return this.boolForKey(this.pDay4);};
	
	Schedule.prototype.setDay5 = function(/*bool*/ day5){this.setBoolForKey(day5,this.pDay5);};
	Schedule.prototype.getDay5 = function(){ return this.boolForKey(this.pDay5);};
	
	Schedule.prototype.setDay6 = function(/*bool*/ day6){this.setBoolForKey(day6,this.pDay6);};
	Schedule.prototype.getDay6 = function(){ return this.boolForKey(this.pDay6);};
	
	Schedule.prototype.setDay7 = function(/*bool*/ day7){this.setBoolForKey(day7,this.pDay7);};
	Schedule.prototype.getDay7 = function(){ return this.boolForKey(this.pDay7);};
	
	Schedule.prototype.setDay8 = function(/*bool*/ day8){this.setBoolForKey(day8,this.pDay8);};
	Schedule.prototype.getDay8 = function(){ return this.boolForKey(this.pDay8);};

	Schedule.prototype.setDay9 = function(/*bool*/ day9){this.setBoolForKey(day9,this.pDay9);};
	Schedule.prototype.getDay9 = function(){ return this.boolForKey(this.pDay9);};
	
	Schedule.prototype.setDay10 = function(/*bool*/ day10){this.setBoolForKey(day10,this.pDay10);};
	Schedule.prototype.getDay10 = function(){ return this.boolForKey(this.pDay10);};
	
	Schedule.prototype.setDay11 = function(/*bool*/ day11){this.setBoolForKey(day11,this.pDay11);};
	Schedule.prototype.getDay11 = function(){ return this.boolForKey(this.pDay11);};
	
	Schedule.prototype.setDay12 = function(/*bool*/ day12){this.setBoolForKey(day12,this.pDay12);};
	Schedule.prototype.getDay12 = function(){ return this.boolForKey(this.pDay12);};
	
	Schedule.prototype.setDay13 = function(/*bool*/ day13){this.setBoolForKey(day13,this.pDay13);};
	Schedule.prototype.getDay13 = function(){ return this.boolForKey(this.pDay13);};
	
	Schedule.prototype.setDay14 = function(/*bool*/ day14){this.setBoolForKey(day14,this.pDay14);};
	Schedule.prototype.getDay14 = function(){ return this.boolForKey(this.pDay14);};
	
	Schedule.prototype.setDay15 = function(/*bool*/ day15){this.setBoolForKey(day15,this.pDay15);};
	Schedule.prototype.getDay15 = function(){ return this.boolForKey(this.pDay15);};
	
	Schedule.prototype.setDay16 = function(/*bool*/ day16){this.setBoolForKey(day16,this.pDay16);};
	Schedule.prototype.getDay16 = function(){ return this.boolForKey(this.pDay16);};
	
	Schedule.prototype.setDay17 = function(/*bool*/ day17){this.setBoolForKey(day17,this.pDay17);};
	Schedule.prototype.getDay17 = function(){ return this.boolForKey(this.pDay17);};
	
	Schedule.prototype.setDay18 = function(/*bool*/ day18){this.setBoolForKey(day18,this.pDay18);};
	Schedule.prototype.getDay18 = function(){ return this.boolForKey(this.pDay18);};
	
	Schedule.prototype.setDay19 = function(/*bool*/ day19){this.setBoolForKey(day19,this.pDay19);};
	Schedule.prototype.getDay19 = function(){ return this.boolForKey(this.pDay19);};
	
	Schedule.prototype.setDay20 = function(/*bool*/ day20){this.setBoolForKey(day20,this.pDay20);};
	Schedule.prototype.getDay20 = function(){ return this.boolForKey(this.pDay20);};
	
	Schedule.prototype.setDay21= function(/*bool*/ day21){this.setBoolForKey(day21,this.pDay21);};
	Schedule.prototype.getDay21 = function(){ return this.boolForKey(this.pDay21);};
	
	Schedule.prototype.setDay22 = function(/*bool*/ day22){this.setBoolForKey(day22,this.pDay22);};
	Schedule.prototype.getDay22 = function(){ return this.boolForKey(this.pDay22);};
	
	Schedule.prototype.setDay23 = function(/*bool*/ day23){this.setBoolForKey(day23,this.pDay23);};
	Schedule.prototype.getDay23 = function(){ return this.boolForKey(this.pDay23);};
	
	Schedule.prototype.setDay24 = function(/*bool*/ day24){this.setBoolForKey(day24,this.pDay24);};
	Schedule.prototype.getDay24 = function(){ return this.boolForKey(this.pDay24);};
	
	Schedule.prototype.setDay25 = function(/*bool*/ day25){this.setBoolForKey(day25,this.pDay25);};
	Schedule.prototype.getDay25 = function(){ return this.boolForKey(this.pDay25);};
	
	Schedule.prototype.setDay26 = function(/*bool*/ day26){this.setBoolForKey(day26,this.pDay26);};
	Schedule.prototype.getDay26 = function(){ return this.boolForKey(this.pDay26);};
	
	Schedule.prototype.setDay27 = function(/*bool*/ day27){this.setBoolForKey(day27,this.pDay27);};
	Schedule.prototype.getDay27 = function(){ return this.boolForKey(this.pDay27);};
	
	Schedule.prototype.setDay28 = function(/*bool*/ day28){this.setBoolForKey(day28,this.pDay28);};
	Schedule.prototype.getDay28 = function(){ return this.boolForKey(this.pDay28);};
	
	Schedule.prototype.setDay29 = function(/*bool*/ day29){this.setBoolForKey(day29,this.pDay29);};
	Schedule.prototype.getDay29 = function(){ return this.boolForKey(this.pDay29);};
	
	Schedule.prototype.setDay30 = function(/*bool*/ day30){this.setBoolForKey(day30,this.pDay30);};
	Schedule.prototype.getDay30 = function(){ return this.boolForKey(this.pDay30);};
	
	Schedule.prototype.setDay31 = function(/*bool*/ day31){this.setBoolForKey(day31,this.pDay31);};
	Schedule.prototype.getDay31 = function(){ return this.boolForKey(this.pDay31);};
	
	/*************** dias de la semana *****************/
	
	Schedule.prototype.setMonday = function(/*bool*/ monday){this.setBoolForKey(monday,this.pMonday);};
	Schedule.prototype.getMonday = function(){ return this.boolForKey(this.pMonday);};
	
	Schedule.prototype.setTuesday = function(/*bool*/ tuesday){this.setBoolForKey(tuesday,this.pTuesday);};
	Schedule.prototype.getTuesday = function(){ return this.boolForKey(this.pTuesday);};
	
	Schedule.prototype.setWednesday = function(/*bool*/ wednesday){this.setBoolForKey(wednesday,this.pWednesday);};
	Schedule.prototype.getWednesday = function(){ return this.boolForKey(this.pWednesday);};
	
	Schedule.prototype.setThursday = function(/*bool*/ thursday){this.setBoolForKey(thursday,this.pThursday);};
	Schedule.prototype.getThursday = function(){ return this.boolForKey(this.pThursday);};
	
	Schedule.prototype.setFriday = function(/*bool*/ friday){this.setBoolForKey(friday,this.pFriday);};
	Schedule.prototype.getFriday = function(){ return this.boolForKey(this.pFriday);};
	
	Schedule.prototype.setSaturday = function(/*bool*/ saturday){this.setBoolForKey(saturday,this.pSaturday);};
	Schedule.prototype.getSaturday = function(){ return this.boolForKey(this.pSaturday);};
	
	Schedule.prototype.setSunday = function(/*bool*/ sunday){this.setBoolForKey(sunday,this.pSunday);};
	Schedule.prototype.getSunday = function(){ return this.boolForKey(this.pSunday);};

	/********************* nombre de los meses **************************/
	
	Schedule.prototype.setJanuary = function(/*bool*/ january){this.setBoolForKey(january,this.pJanuary);};
	Schedule.prototype.getJanuary = function(){ return this.boolForKey(this.pJanuary);};
	
	Schedule.prototype.setFebruary = function(/*bool*/ february){this.setBoolForKey(february,this.pFebruary);};
	Schedule.prototype.getFebruary = function(){ return this.boolForKey(this.pFebruary);};
	
	Schedule.prototype.setMarch = function(/*bool*/ march){this.setBoolForKey(march,this.pMarch);};
	Schedule.prototype.getMarch = function(){ return this.boolForKey(this.pMarch);};
	
	Schedule.prototype.setApril = function(/*bool*/ april){this.setBoolForKey(april,this.pApril);};
	Schedule.prototype.getApril = function(){ return this.boolForKey(this.pApril);};
	
	Schedule.prototype.setMay = function(/*bool*/ may){this.setBoolForKey(may,this.pMay);};
	Schedule.prototype.getMay = function(){ return this.boolForKey(this.pMay);};
	
	Schedule.prototype.setJune = function(/*bool*/ june){this.setBoolForKey(june,this.pJune);};
	Schedule.prototype.getJune = function(){ return this.boolForKey(this.pJune);};
	
	Schedule.prototype.setJuly = function(/*bool*/ july){this.setBoolForKey(july,this.pJuly);};
	Schedule.prototype.getJuly = function(){ return this.boolForKey(this.pJuly);};
	
	Schedule.prototype.setAugust = function(/*bool*/ august){this.setBoolForKey(august,this.pAugust);};
	Schedule.prototype.getAugust = function(){ return this.boolForKey(this.pAugust);};
	
	Schedule.prototype.setSeptember = function(/*bool*/ september){this.setBoolForKey(september,this.pSeptember);};
	Schedule.prototype.getSeptember = function(){ return this.boolForKey(this.pSeptember);};
	
	Schedule.prototype.setOctober = function(/*bool*/ october){this.setBoolForKey(october,this.pOctober);};
	Schedule.prototype.getOctober = function(){ return this.boolForKey(this.pOctober);};
	
	Schedule.prototype.setNovember = function(/*bool*/ november){this.setBoolForKey(november,this.pNovember);};
	Schedule.prototype.getNovember = function(){ return this.boolForKey(this.pNovember);};
	
	Schedule.prototype.setDecember = function(/*bool*/ december){this.setBoolForKey(december,this.pDecember);};
	Schedule.prototype.getDecember = function(){ return this.boolForKey(this.pDecember);};
	/********************* fin nombre de los meses **************************/
	
	//Create Properties

	Schedule.prototype.dateIni = "";
	Object.defineProperty(Schedule.prototype,"dateIni",{
		set	: function dateIni(v) { this.setDateIni(v); },
		get : function dateIni() { return this.getDateIni(); }
	});

	Schedule.prototype.dateEnd = "";
	Object.defineProperty(Schedule.prototype,"dateEnd",{
		set	: function dateEnd(v) { this.setDateEnd(v); },
		get : function dateEnd() { return this.getDateEnd(); }
	});

	Schedule.prototype.hourIni = "";
	Object.defineProperty(Schedule.prototype,"hourIni",{
		set	: function hourIni(v) { this.setHourIni(v); },
		get : function hourIni() { return this.getHourIni(); }
	});

	Schedule.prototype.hourEnd = "";
	Object.defineProperty(Schedule.prototype,"hourEnd",{
		set	: function hourEnd(v) { this.setHourEnd(v); },
		get : function hourEnd() { return this.getHourEnd(); }
	});

	Schedule.prototype.name = "";
	Object.defineProperty(Schedule.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Schedule.prototype.Idinfocard = "";
	Object.defineProperty(Schedule.prototype,"Idinfocard",{
		set	: function Idinfocard(v) { this.setIdinfocard(v); },
		get : function Idinfocard() { return this.getIdinfocard(); }
	});

	Schedule.prototype.maxUser = "";
	Object.defineProperty(Schedule.prototype,"maxUser",{
		set	: function maxUser(v) { this.setMaxUser(v); },
		get : function maxUser() { return this.getMaxUser(); }
	});

	Schedule.prototype.AntennasList = [];
	Object.defineProperty(Schedule.prototype, "AntennasList", {
			set : function AntennasList(v) { this.setAntennasList(v); },
		    get : function AntennasList()  { return this.getAntennasList();}
	});
	
	/****************************** REPETICION *************************************/
	
	Schedule.prototype.repetition = "";
	Object.defineProperty(Schedule.prototype,"repetition",{
		set	: function repetition(v) { this.setRepetition(v); },
		get : function repetition() { return this.getRepetition(); }
	});
	
	Schedule.prototype.everyDaily = "";
	Object.defineProperty(Schedule.prototype,"everyDaily",{
		set	: function everyDaily(v) { this.setEveryDaily(v); },
		get : function everyDaily() { return this.getEveryDaily(); }
	});

	Schedule.prototype.everyWeekly = "";
	Object.defineProperty(Schedule.prototype,"everyWeekly",{
		set	: function everyWeekly(v) { this.setEveryWeekly(v); },
		get : function everyWeekly() { return this.getEveryWeekly(); }
	});
	
	Schedule.prototype.everyMonthly = "";
	Object.defineProperty(Schedule.prototype,"everyMonthly",{
		set	: function everyMonthly(v) { this.setEveryMonthly(v); },
		get : function everyMonthly() { return this.getEveryMonthly(); }
	});
	
	Schedule.prototype.everyYearly = "";
	Object.defineProperty(Schedule.prototype,"everyYearly",{
		set	: function everyYearly(v) { this.setEveryYearly(v); },
		get : function everyYearly() { return this.getEveryYearly(); }
	});
	
	Schedule.prototype.everyExactlySelection = "";
	Object.defineProperty(Schedule.prototype,"everyExactlySelection",{
		set	: function everyExactlySelection(v) { this.setEveryExactlySelection(v); },
		get : function everyExactlySelection() { return this.getEveryExactlySelection (); }
	});
	
	Schedule.prototype.everyExactlyDay = "";
	Object.defineProperty(Schedule.prototype,"everyExactlyDay",{
		set	: function everyExactlyDay(v) { this.setEveryExactlyDay(v); },
		get : function everyExactlyDay() { return this.getEveryExactlyDay(); }
	});
	
	Schedule.prototype.every = "";
	Object.defineProperty(Schedule.prototype,"every",{
		set	: function every(v) { this.setEvery(v); },
		get : function every() { return this.getEvery(); }
	});
	
	/** FIN **/
	
	/*** END && STATICO ***/
	
	Schedule.prototype.end = "";
	Object.defineProperty(Schedule.prototype,"end",{
		set	: function end(v) { this.setEnd(v); },
		get : function end() { return this.getEnd(); }
	});
	
	Schedule.prototype.statico = "";
	Object.defineProperty(Schedule.prototype,"statico",{
		set	: function statico(v) { this.setStatico(v); },
		get : function statico() { return this.getStatico(); }
	});
	
	/** DIAS **/
	
	Schedule.prototype.day1 = "";
	Object.defineProperty(Schedule.prototype,"day1",{
		set	: function day1(v) { this.setDay1(v); },
		get : function day1() { return this.getDay1(); }
	});
	
	Schedule.prototype.day2 = "";
	Object.defineProperty(Schedule.prototype,"day2",{
		set	: function day2(v) { this.setDay2(v); },
		get : function day2() { return this.getDay2(); }
	});
	
	Schedule.prototype.day3 = "";
	Object.defineProperty(Schedule.prototype,"day3",{
		set	: function day3(v) { this.setDay3(v); },
		get : function day3() { return this.getDay3(); }
	});
	
	Schedule.prototype.day4 = "";
	Object.defineProperty(Schedule.prototype,"day4",{
		set	: function day4(v) { this.setDay4(v); },
		get : function day4() { return this.getDay4(); }
	});
	
	Schedule.prototype.day5 = "";
	Object.defineProperty(Schedule.prototype,"day5",{
		set	: function day5(v) { this.setDay5(v); },
		get : function day5() { return this.getDay5(); }
	});
	
	Schedule.prototype.day6 = "";
	Object.defineProperty(Schedule.prototype,"day6",{
		set	: function day6(v) { this.setDay6(v); },
		get : function day6() { return this.getDay6(); }
	});
	

	Schedule.prototype.day7 = "";
	Object.defineProperty(Schedule.prototype,"day7",{
		set	: function day7(v) { this.setDay7(v); },
		get : function day7() { return this.getDay7(); }
	});
	
	Schedule.prototype.day8 = "";
	Object.defineProperty(Schedule.prototype,"day8",{
		set	: function day8(v) { this.setDay8(v); },
		get : function day8() { return this.getDay8(); }
	});
	
	Schedule.prototype.day9 = "";
	Object.defineProperty(Schedule.prototype,"day9",{
		set	: function day9(v) { this.setDay9(v); },
		get : function day9() { return this.getDay9(); }
	});
	
	Schedule.prototype.day10 = "";
	Object.defineProperty(Schedule.prototype,"day10",{
		set	: function day10(v) { this.setDay10(v); },
		get : function day10() { return this.getDay10(); }
	});
	
	Schedule.prototype.day11 = "";
	Object.defineProperty(Schedule.prototype,"day11",{
		set	: function day11(v) { this.setDay11(v); },
		get : function day11() { return this.getDay11(); }
	});
	
	Schedule.prototype.day12 = "";
	Object.defineProperty(Schedule.prototype,"day12",{
		set	: function day12(v) { this.setDay12(v); },
		get : function day12() { return this.getDay12(); }
	});

	Schedule.prototype.day13 = "";
	Object.defineProperty(Schedule.prototype,"day13",{
		set	: function day13(v) { this.setDay13(v); },
		get : function day13() { return this.getDay13(); }
	});
	
	Schedule.prototype.day14 = "";
	Object.defineProperty(Schedule.prototype,"day14",{
		set	: function day14(v) { this.setDay14(v); },
		get : function day14() { return this.getDay14(); }
	});
	
	Schedule.prototype.day15 = "";
	Object.defineProperty(Schedule.prototype,"day15",{
		set	: function day15(v) { this.setDay15(v); },
		get : function day15() { return this.getDay15(); }
	});
	
	Schedule.prototype.day16 = "";
	Object.defineProperty(Schedule.prototype,"day16",{
		set	: function day16(v) { this.setDay16(v); },
		get : function day16() { return this.getDay16(); }
	});
	
	Schedule.prototype.day17 = "";
	Object.defineProperty(Schedule.prototype,"day17",{
		set	: function day17(v) { this.setDay17(v); },
		get : function day17() { return this.getDay17(); }
	});
	
	Schedule.prototype.day18 = "";
	Object.defineProperty(Schedule.prototype,"day18",{
		set	: function day18(v) { this.setDay18(v); },
		get : function day18() { return this.getDay18(); }
	});
	

	Schedule.prototype.day19 = "";
	Object.defineProperty(Schedule.prototype,"day19",{
		set	: function day19(v) { this.setDay19(v); },
		get : function day19() { return this.getDay19(); }
	});
		
	Schedule.prototype.day20 = "";
	Object.defineProperty(Schedule.prototype,"day20",{
		set	: function day20(v) { this.setDay20(v); },
		get : function day20() { return this.getDay20(); }
	});
	
	Schedule.prototype.day21 = "";
	Object.defineProperty(Schedule.prototype,"day21",{
		set	: function day21(v) { this.setDay21(v); },
		get : function day21() { return this.getDay21(); }
	});
	
	Schedule.prototype.day22 = "";
	Object.defineProperty(Schedule.prototype,"day22",{
		set	: function day22(v) { this.setDay22(v); },
		get : function day22() { return this.getDay22(); }
	});
	
	Schedule.prototype.day23 = "";
	Object.defineProperty(Schedule.prototype,"day23",{
		set	: function day23(v) { this.setDay23(v); },
		get : function day23() { return this.getDay23(); }
	});
	
	Schedule.prototype.day24 = "";
	Object.defineProperty(Schedule.prototype,"day24",{
		set	: function day24(v) { this.setDay24(v); },
		get : function day24() { return this.getDay24(); }
	});

	Schedule.prototype.day25 = "";
	Object.defineProperty(Schedule.prototype,"day25",{
		set	: function day25(v) { this.setDay25(v); },
		get : function day25() { return this.getDay25(); }
	});
	
	Schedule.prototype.day26 = "";
	Object.defineProperty(Schedule.prototype,"day26",{
		set	: function day26(v) { this.setDay26(v); },
		get : function day26() { return this.getDay26(); }
	});
	
	Schedule.prototype.day27 = "";
	Object.defineProperty(Schedule.prototype,"day27",{
		set	: function day27(v) { this.setDay27(v); },
		get : function day27() { return this.getDay27(); }
	});
	
	Schedule.prototype.day28 = "";
	Object.defineProperty(Schedule.prototype,"day28",{
		set	: function day28(v) { this.setDay28(v); },
		get : function day28() { return this.getDay28(); }
	});
	
	Schedule.prototype.day29 = "";
	Object.defineProperty(Schedule.prototype,"day29",{
		set	: function day29(v) { this.setDay29(v); },
		get : function day29() { return this.getDay29(); }
	});

	Schedule.prototype.day30 = "";
	Object.defineProperty(Schedule.prototype,"day30",{
		set	: function day30(v) { this.setDay30(v); },
		get : function day30() { return this.getDay30(); }
	});
	
	Schedule.prototype.day31 = "";
	Object.defineProperty(Schedule.prototype,"day31",{
		set	: function day31(v) { this.setDay31(v); },
		get : function day31() { return this.getDay31(); }
	});


/********* dias de la semana *********/
		
	Schedule.prototype.monday = "";
	Object.defineProperty(Schedule.prototype,"monday",{
		set	: function monday(v) { this.setMonday(v); },
		get : function monday() { return this.getMonday(); }
	});
	
	Schedule.prototype.tuesday = "";
	Object.defineProperty(Schedule.prototype,"tuesday",{
		set	: function tuesday(v) { this.setTuesday(v); },
		get : function tuesday() { return this.getTuesday(); }
	});
	
	Schedule.prototype.wednesday = "";
	Object.defineProperty(Schedule.prototype,"wednesday",{
		set	: function wednesday(v) { this.setWednesday(v); },
		get : function wednesday() { return this.getWednesday(); }
	});
	
	Schedule.prototype.thursday = "";
	Object.defineProperty(Schedule.prototype,"thursday",{
		set	: function thursday(v) { this.setThursday(v); },
		get : function thursday() { return this.getThursday(); }
	});
	
	Schedule.prototype.friday = "";
	Object.defineProperty(Schedule.prototype,"friday",{
		set	: function friday(v) { this.setFriday(v); },
		get : function friday() { return this.getFriday(); }
	});

	Schedule.prototype.saturday = "";
	Object.defineProperty(Schedule.prototype,"saturday",{
		set	: function saturday(v) { this.setSaturday(v); },
		get : function saturday() { return this.getSaturday(); }
	});
	
	Schedule.prototype.sunday = "";
	Object.defineProperty(Schedule.prototype,"sunday",{
		set	: function sunday(v) { this.setSunday(v); },
		get : function sunday() { return this.getSunday(); }
	});

	/********************* nombre de los meses **************************/
	
	Schedule.prototype.january = "";
	Object.defineProperty(Schedule.prototype,"january",{
		set	: function january(v) { this.setJanuary(v); },
		get : function january() { return this.getJanuary(); }
	});
	
	Schedule.prototype.february = "";
	Object.defineProperty(Schedule.prototype,"february",{
		set	: function february(v) { this.setFebruary(v); },
		get : function february() { return this.getFebruary(); }
	});
	
	Schedule.prototype.march = "";
	Object.defineProperty(Schedule.prototype,"march",{
		set	: function march(v) { this.setMarch(v); },
		get : function march() { return this.getMarch(); }
	});
	
	Schedule.prototype.april = "";
	Object.defineProperty(Schedule.prototype,"april",{
		set	: function april(v) { this.setApril(v); },
		get : function april() { return this.getApril(); }
	});
	
	Schedule.prototype.may = "";
	Object.defineProperty(Schedule.prototype,"may",{
		set	: function may(v) { this.setMay(v); },
		get : function may() { return this.getMay(); }
	});
	
	Schedule.prototype.june = "";
	Object.defineProperty(Schedule.prototype,"june",{
		set	: function june(v) { this.setJune(v); },
		get : function june() { return this.getJune(); }
	});
	
	Schedule.prototype.july = "";
	Object.defineProperty(Schedule.prototype,"july",{
		set	: function july(v) { this.setJuly(v); },
		get : function july() { return this.getJuly(); }
	});

	Schedule.prototype.august = "";
	Object.defineProperty(Schedule.prototype,"august",{
		set	: function august(v) { this.setAugust(v); },
		get : function august() { return this.getAugust(); }
	});
	
	Schedule.prototype.september = "";
	Object.defineProperty(Schedule.prototype,"september",{
		set	: function september(v) { this.setSeptember(v); },
		get : function september() { return this.getSeptember(); }
	});
	
	Schedule.prototype.october = "";
	Object.defineProperty(Schedule.prototype,"october",{
		set	: function october(v) { this.setOctober(v); },
		get : function october() { return this.getOctober(); }
	});
	
	Schedule.prototype.november = "";
	Object.defineProperty(Schedule.prototype,"november",{
		set	: function november(v) { this.setNovember(v); },
		get : function november() { return this.getNovember(); }
	});
	
	Schedule.prototype.december = "";
	Object.defineProperty(Schedule.prototype,"december",{
		set	: function december(v) { this.setDecember(v); },
		get : function december() { return this.getDecember(); }
	});
	

	
	
	
asm.setServerUrl(fibity.manager.api.url);
asm.setServerAuthentication("2308jidj98iasughc87sh78ch8", "asdb87nauisjhbdi723uybhs8d7", "asdjn98787ashd87atsd7fguajh9");
asm.setExpiredTime(3600);
      
asm.configKind( Antenna.entityKind,				   true,  		   true,			 60);
asm.configKind( AntennaActivation.entityKind,       true,           true,          60);
asm.configKind( Schedule.entityKind,                true,           true,          60);
//asm.configKind( Config.entityKind,                false,          true,          60000);
asm.configKind( InfoCard.entityKind,                true,           true,          60);
asm.configKind( Organization.entityKind,            true,           true,          60);   
asm.configKind( Campaign.entityKind,        		   true,           true,          60);    
asm.configKind( Customers.entityKind,               true,           true,          60);  
asm.configKind( Billing.entityKind,                 true,           true,          60);        
asm.configKind(   "record",                         true,           true,          60);
asm.configKind(   "version",                        true,           true,          60);