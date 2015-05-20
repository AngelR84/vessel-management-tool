
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

					this.currentOrganization = "";
					this.appId = fibity.manager.api.appId;
					
					//Si hay token -> consultar token

					//Si no hay token -> login

					//Recuperar el token

					//recuperar la lista de organizaciones

					//seleccionar la primera org como predeterminada.

					//

			

		},
		
					initAPI: function(){
						gapi.client.load('dev', 'v1beta2', function() {
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
		 	  			if(profile == undefined){
		 	  				localStorage.removeItem(this.profileKey);
		 	  			}else{ 
		 	  				localStorage[this.profileKey] = JSON.stringify(profile);
		 	  				this.currentOrganization = profile.organizationsOwner[0];
		 	  			}
		 	  		},
		 	  		
		 	  		
/*future<profile>*/  getProfile: function(){
		 	  			var future = new asyncFuture();
		 	  			if(localStorage[this.profileKey] == undefined){
							request = {
									"deviceId": this.getDeviceId(),
									"token": this.getToken()
							};
							
			 	  			gapi.client.account.getManagerProfile(request).execute(function(resp){
			 	  				if(!resp.error){
			 	  					asm.setProfile(resp.result);
			 	  					future.return(resp.result);
			 	  				}else{
			 	  					asm.testCredentials(resp.error);
			 	  				}
			 	  			});
		 	  			}else{
		 	  				var profile = JSON.parse(localStorage[asm.profileKey]);
		 	  				this.currentOrganization  = profile.organizationsOwner[0];
		 	  				future.return(profile);
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
			 	  				
			 	  				
			 	  				//console.log(resp.items);
			 	  				if(!resp.error){
			 	  					if(resp.items != undefined){
			 	  						console.log(resp.items.length +" objetos " + kind);
				 	  					resp.items.forEach(function(obj){
				 	  						//console.log(obj);
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
		 			        //console.log(myRes);
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
		 			   //console.log(myRes);
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
		 					 //console.log(error.message);
		 					 //location.reload();
		 					 //document.getElementById("fbtm-security").style.display="block";
		 					jQuery( "#fbtm-security" ).fadeIn(200);
		 				  }
		 			  }
		 			  
};

var asm = new ASMFactory();

//angular.module('fbtmApp.services', []).factory('ASMFactory', ['$http', ASMFactoryFunction]);
 

 
 