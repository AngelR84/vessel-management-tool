
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

