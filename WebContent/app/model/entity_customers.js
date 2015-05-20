
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


