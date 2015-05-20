

var EventValidator = Class.create();


EventValidator.prototype = {
				/**
				 * 
				 * @param eventList
				 * @param event
				 */
				initialize: function(/*List*/ eventList, /*Map*/ event){
					//config
					/*List*/ 	  this.eventList = eventList;
					/*Map*/ 	  this.event 	 = event;			
				},

				/**
				 * 
				 * @param eventList
				 * @param event
				 * @returns {Boolean}
				 */
	/*BOOL*/	isValid : function(/*List*/ eventList, /*Map*/ event){
						var result = true;
						//algoritmo
						
						// recorriendo la lista para saber si los eventos excluyentes estan activos todo el dia (allDay == TRUE)
						if(this.eventList.length == 0){
							result = true;
						}
						else{
							for(var j = 0; j < this.eventList.length; j++){
								if(this.eventList[j].allDay == true){
									if(this.testCase1(j) == true){
										result = false;
										break;
									}
									if(this.testCase2(j) == true){
										result = false;
										break;
									}
									if(this.testCase3(j) == true){
										result = false;
										break;
									}
									if(this.testCase4(j) == true){
										result = false;
										break;
									}
								}	
							}
						}
				  return result;
				},
				 
				 /**
				  * 
				  * @param index  indice del evento excluyente dentro de la lista de eventos.
				  * @returns {Boolean}
				  * @function TESTCASE1 = retorna el true si el evento actual se crea antes del evento excluyente y termina dentro del evento excluyente. (true == ERROR)
				  * 
				  * 		============ Evento Actual =============
				  *  									=========== Evento N =======
				  */
				
 /*BOOL*/	 	testCase1: function(/*index de eventList*/index){
					 var result = false;
					 if(this.event.start < this.eventList[index].start &&
						this.event.end  > this.eventList[index].start &&
						this.event.end  <= this.eventList[index].end)
						result = true;
					 
					 return result;
				 },
				 
				 /**
				  * 
				  * @param index
				  * @returns {Boolean}
				  * @function TESTCASE2 = retorna true si el evento actual se crea dentro del evento excluyente y termina fuera o dentro del evento excluyente.(true == ERROR)
				  * 
				  * 						   ============ Evento Actual =============
				  *  	=========== Evento N ==========
				  */
				 
/*BOOL*/	 	testCase2: function(/*index de eventList*/index){
					 var result = false;
					 if(this.event.start > this.eventList[index].start &&
						this.event.start < this.eventList[index].end &&
						this.event.end >= this.eventList[index].end)
						
						result = true;
					 return result;
				 },		
				
				 /**
				  * 
				  * @param index
				  * @returns {Boolean}
				  * @function TESTCASE3 = retorna true si el evento actual se crea fuera del evento excluyente y termina fuera del evento excluyente.(true == ERRRO)
				  * 
				  * 						   ============ Evento Actual =============
				  *  			======================== Evento N ==============================
				  */
				 
/*BOOL*/	 	testCase3: function(/*index de eventList*/index){
					 var result = false;
					 if(this.event.start >= this.eventList[index].start &&
						this.event.start < this.eventList[index].end &&
						this.event.end > this.eventList[index].start &&
						this.event.end <= this.eventList[index].end)
						 result = true;
					 return result;
				 },	
				 
				 /**
				  * 
				  * @param index
				  * @returns {Boolean}
				  * @function TESTCASE3 = retorna true si el evento actual se crea fuera del evento excluyente y termina fuera del evento excluyente.(true == ERRRO)
				  * 
				  * 		=================== Evento Actual ===========================
				  *  				============ Evento N ================
				  */
				 
/*BOOL*/	 	testCase4: function(/*index de eventList*/index){
					 var result = false;
					 if(this.event.start <= this.eventList[index].start &&
						this.event.end >= this.eventList[index].end)
						 result = true;
					 return result;
				 }	
};






















