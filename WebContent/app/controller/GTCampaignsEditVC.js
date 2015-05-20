fibity.manager.app.controller('GTCampaignEditVC',['$scope', '$timeout','$routeParams', function($scope,$timeout,$routeParams){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});

	$scope.activeitem = "campaigns";
	/********************************************/

	$scope.antennasSchedulesMap = {};

	/*Map<String, CampaignsSchedule>*/ $scope.campaignsMap = {}; 
	/*List<String>*/ 	  $scope.campaignsKeyList = [];  

	/*Campaign*/		   $scope.tmpCampaign = new Campaign(); //campaña a modificar
	/*Campaign*/		   $scope.originalCampaign = new Campaign(); //Campaña original
	
	/*List<String>*/   $scope.campaignsKeyList = [];  //Lista que contiene todos los ids de Campaña del modelo
	                   $scope.campaignsMap = {};  //Mapa que contiene todos los objetos Campaña del modelo 
	
	 /*List<String>*/  $scope.infoCardsKeyList = []; //Lista que contiene todos los ids de Infocard del modelo
	 /*Map<String>*/   $scope.infoCardsMap = {}; //Mapa que contiene todos los objetos Infocard del modelo
	 
	 /*Map<String>*/   $scope.AntennasMap = {}; //Mapa que contiene todos las antenas del modelo
	 				   $scope.AntennasKeyList = [];
	 				   
	 				   $scope.AntennasKeyListValid = [];  // Antenas filtradas que cumplen las condiciones de los modos estatico y dinamico.
	 				   $scope.AntennasKeyListSelected = [];  // Antenas asociadas a la campaña
	 				   $scope.AntennasKeyListAvailable = []; // = AntennasKeyListValids - AntennasKeyListSelected
	 				   
 	/*Map<String, Schedule Calendar>*/ $scope.scheduleList = {}; 
	/*List<String>*/ 	  $scope.scheduleKeyList = []; 
	/*Schedule*/ 		  $scope.tmpschedule;
	/*Map<ScheduleId,List<AntennaId>>*/ $scope.mapSchedulesExt = {}; 
	/*List<ScheduleId>*/ $scope.listSchedulesExt = []; 
	
	$scope.visibility = {};
	$scope.visibility.botonLoading = false;
	/*bool*/   $scope.txtfocus1 = true;
	
	/**
	 * T	extos de la vista
	 */
		$scope.msgs = {};
		$scope.msgs.enableDynamicMode = "Activar modo dinámico";
		$scope.msgs.disableDynamicMode = "Desactivar modo dinámico";
		$scope.msgs.dynamicMode = "Dinámica";
		$scope.msgs.staticMode = "Estática";
	
	/**
	 * Control de pestaña activa
	 */
		$scope.tab = [];	
		$scope.tab[0] = {"active": true};
		
	/**
	 * Inicializamos el modelo asociado al calendario.
	 */
	
		$scope.calEvents = 0;
		$scope.calEventsExt = 1;
		
		$scope.actualEvent = 0;
		/* event sources array*/
	    $scope.eventSources = [];
	
		/*mapa de eventos excluyentes*/ 
		$scope.eventSources[$scope.calEventsExt] = [];
		
		$scope.eventSources[$scope.calEvents] =[];
		//$scope.eventSources[$scope.calEventsExt].events
	
	/**
	 * FIN configuración modelo asociado al calendario
	 */
		
	/**
	* Objeto Calendario
	*/
		$scope.myCalendar1;
	
	/**
	 *  Métodos auxiliares de Calendario
	 */
	
	/**
	 *  Renderiza un calendario
	 */
		$scope.renderCalender = function(calendar) {
			console.log("renderCalendar()");
	        if(calendar){
	          calendar.fullCalendar('render');
	          calendar.fullCalendar('refetchEvents');
	        }
		};
      
     /**
      *  Renderiza myCalendar1
      */
	     $scope.updateCalendar = function(){
	    	 	console.log("updateCalendar()");
	  		$scope.renderCalender(jQuery('#calendar'));
	  	 };
	
	
	  // Variables
    $scope.datosEvents = {};
    $scope.datosEvents.allDay = true;
    $scope.btncalen = true;
    $scope.showError = false;
    $scope.showConflict = false;
    $scope.showTime = false;
    $scope.showDelete = false;
    $scope.showConfirm = false;
    $scope.disabledCalendar = false;
    $scope.infoCalendar = false;
    $scope.modeStatic = false;
    $scope.txtDinamic = "Dinámico";
    $scope.txtStatic = "Estático";
    $scope.btnStatic = "Activar modo estático";
    $scope.btnDinamic = "Desactivar modo estático";
	
	 /*bool*/ $scope.viewAnt = true;
	 $scope.show = false;
	 $scope.phase2 = false;
	 
	    /*String*/ $scope.urlImgOrgBackground = "";
		 
	   
	    
	    
	    
	    
	    
	/**
	 * 
	 * 
	 * 				Load Entities
	 * 
	 * 
	 * 
	 * 
	 * 
	 */    
	    
	    
    	
    /**
     * updateAntennasScheduleMap()
     * 
     * Actualiza el mapa que relaciona las antenas con los schedules a los que estan asociadas.
     * 
     */
	    
	    




	    
	$scope.entitiesLoadedNumber = 0;
	  
	$scope.entityLoaded = function(){
		$scope.entitiesLoadedNumber++;
		if($scope.entitiesLoadedNumber == 5)
			$scope.loadDataView();
		
	};
	
    $scope.updateAntennasScheduleMap = function(){
        /**
         * Inicializamos $scope.antennasSchedulesMap con todas las antenas; 
         */	 
        $scope.AntennasKeyList.forEach(function(id){
        		 $scope.antennasSchedulesMap[id] = [];
        });	 
    				
        //console.log($scope.antennasSchedulesMap);
        Campaign.fromEntityList(asm.getAllEntitiesOfKind(Campaign.entityKind))
          	.then(function(list){
        			list.forEach(function(campaignsSchedule){
        				
        				camp = new Campaign();
        				camp.initFromEntity(campaignsSchedule);
        				
        				$scope.campaignsMap[camp.id] = camp;
        				$scope.campaignsKeyList.push(camp.id);
        				
        				//Actualizamos el mapa mapAtennasSchedules para conocer que schedule estan asociados a que antennas
        				camp.getAntennasList().forEach(function(antennaId){
            				if(camp.getSchedulesList().length > 0){
            					$scope.antennasSchedulesMap[antennaId].push({"campaignId" :camp.id, "scheduleId": camp.getSchedulesList()[0]});
            				}else{
            					$scope.antennasSchedulesMap[antennaId].push({"campaignId" :camp.id});
            				}
        				});
        			});
        			
        	}).finally(function(){
   			 $scope.entityLoaded();
   		 }).done();
   	};
	
	 
     $scope.loadSchedules = function(){  
		 Schedule.fromEntityList(asm.getAllEntitiesOfKind(Schedule.entityKind))
		 .then(function(list){
			 list.forEach(function(schedule){
				 var sche = new Schedule();
				 sche.initFromEntity(schedule);
				$scope.scheduleKeyList.push(sche.id);
				$scope.scheduleList[sche.id] = sche;
			 });
		 }).finally(function(){
			 $scope.entityLoaded();
		 }).done();
     };	 
     $scope.loadInfocards = function(){
		 InfoCard.fromEntityList(asm.getAllEntitiesOfKind(InfoCard.entityKind))
			.then(function(list){
				list.forEach(function(infocard){
					var ic = new InfoCard();
					ic.initFromEntity(infocard);
					$scope.infoCardsMap[ic.id] = ic;
					$scope.infoCardsKeyList.push(ic);
				});
			}).finally(function(){
				 $scope.entityLoaded();
			 }).done();
     };
     $scope.loadAntennas = function(){ 
		 Antenna.fromEntityList(asm.getAllEntitiesOfKind(Antenna.entityKind))
			.then(function(list){
				list.forEach(function(antenna){
					var ant = new Antenna();
					ant.initFromEntity(antenna);
					$scope.AntennasKeyList.push(ant.id);
					$scope.AntennasMap[ant.id] = ant;
				});
			}).finally(function(){
				 $scope.updateAntennasScheduleMap();
				 $scope.entityLoaded();
			 }).done();
     };
     
 	$scope.loadOriginal = function(){
 		
		$scope.tmpCampaign.initFromCache($scope.originalCampaign.json());
		
		if($routeParams.campaignId == undefined){
			$scope.path = [{"name":"Campañas", "href": "#/campaigns/collection"},
		               {"name": "Nueva Campaña", "href": "#/campaigns/new/"}];
		}else{
			$scope.path = [{"name":"Campañas", "href": "#/campaigns/collection"},
			               {"name": $scope.tmpCampaign.name, "href": "#/campaigns/edit/" + $scope.tmpCampaign.id}];
		}
		
		var json = JSON.stringify($scope.tmpCampaign.getAntennasList());
		$scope.AntennasKeyListSelected = JSON.parse(json);
	
	};
	
	$scope.loadCampaign = function(){
		if($routeParams.campaignId == undefined){
			$scope.originalCampaign.init({});
			$scope.originalCampaign.name = "Nueva Campaña";
			$scope.originalCampaign.dynamicMode = false;
			$scope.loadOriginal();
			console.log($scope.tmpCampaign);
			$scope.entityLoaded();
		}else{
			asm.getEntityOfKindById(Campaign.entityKind,$routeParams.campaignId).then(function(entity){
				if(entity == null){
					$window.history.back();
				}else{
					$scope.originalCampaign.initFromEntity(entity);
					$scope.loadOriginal();
				}
			}).finally(function(){
				 $scope.entityLoaded();
			 }).done();
		}
	};	
	
     $scope.loadEntities = function(){
    	 	$scope.loadSchedules();
    	 	$scope.loadInfocards();
    	 	$scope.loadAntennas();
    	 	$scope.loadCampaign();
     }

     
 
	 $scope.activarDynamic = function(changeState){
		 console.log("activarDynamic("+ changeState +")");
	  		if($scope.tmpCampaign.dynamicMode == false){
	  			//Activamos modo dinamico 
	  			$scope.changeDynamicMode(true);
	  		}else{
	  		// desactivamos Modo dinamico
	  			$scope.changeDynamicMode(false);
	  		}
		};   

		
	$scope.changeDynamicMode = function(changeState){
		console.log("changeDynamicMode("+ changeState +")");
		if(changeState){
			//Activamos modo dinamico 
			$scope.tmpCampaign.dynamicMode = true;
			$scope.disabledCalendar = false;
			$scope.btnCampaignTypeName = $scope.msgs.disableDynamicMode;
			$scope.lblDynamicModeState = $scope.msgs.dynamicMode;
			$scope.dynamicValidFilter();
		}else{
		// desactivamos Modo dinamico
			$scope.tmpCampaign.dynamicMode = false;
			$scope.disabledCalendar = true;
			$scope.tab[0].active = true; 
			$scope.btnCampaignTypeName = $scope.msgs.enableDynamicMode;
			$scope.lblDynamicModeState = $scope.msgs.staticMode;
			
			$scope.staticValidFilter();
		}
		$scope.updateCalendarForCampaignAntenas();
	};   
	 
	
	//Actualizamos el calendario para las antenas asignadas a la campaña.
	$scope.updateCalendarForCampaignAntenas = function(){
		console.log("updateCalendarForCampaignAntenas()");
		$scope.mapSchedulesExt = {}; 
		$scope.listSchedulesExt = []; 
		$scope.AntennasKeyListSelected.forEach(function(/*AntennaId*/ antId){
			$scope.addAntenaInMapSchedulesExt(antId);
		});
		$scope.updateEventsExtInCalendar();
		$scope.updateCalendar();
	};
	

	/*Añadir antenaID a lista de antenas asociadas a un scheduleId*/
	$scope.addAntenaInMapSchedulesExt = function(/*AntennaId*/ antId){

		console.log("addAntenaInMapSchedulesExt()");
		sid = "";
		if($scope.tmpCampaign.getSchedulesList() != undefined) { sid = $scope.tmpCampaign.getSchedulesList()[0]; }
			if($scope.antennasSchedulesMap[antId] != undefined){
				$scope.antennasSchedulesMap[antId].forEach(function(/*{"campaignId": ID , "scheduleId": ID}*/ data){
					if(data.scheduleId != undefined && data.scheduleId != sid){
						if($scope.mapSchedulesExt[data.scheduleId] == undefined)
							$scope.mapSchedulesExt[data.scheduleId] = [];
						
						$scope.mapSchedulesExt[data.scheduleId].push(antId); 
						
						
						
						//Añadimos el schedule ID a la lista de schedules utilizados.
						encontrado  = false;
						$scope.listSchedulesExt.forEach( function(sId){
							if(data.scheduleId == sId) encontrado = true;
						});
						
						if(!encontrado)
							$scope.listSchedulesExt.push(data.scheduleId);
					}
				});
			}
	};
	
	/*Actualizar lista de eventos excluyentes a partir de Schedules*/
	$scope.updateEventsExtInCalendar = function(){
		console.log("updateEventsExtInCalendar()");
		$scope.eventSources[$scope.calEventsExt] = [];
		
		//$scope.eventSources[$scope.calEventsExt].events.splice(0, $scope.eventSources[$scope.calEventsExt].events.length);

		$scope.listSchedulesExt.forEach(function(scheduleId){
			var antenasName = " ( ";
			
			$scope.mapSchedulesExt[scheduleId].forEach(function (antenaID){
				antenasName = antenasName + $scope.AntennasMap[antenaID].name + " ";
			});
			antenasName = antenasName + ")";
			event = {};
			event.title = antenasName;
			event.start = new Date($scope.scheduleList[scheduleId].dateIni);
			event.end = new Date($scope.scheduleList[scheduleId].dateEnd);
			event.allDay = $scope.scheduleList[scheduleId].every;
			event.color = "#fc969e";
			event.editable = false;
			$scope.eventSources[$scope.calEventsExt].push(event);
		});
	};
	
	
	/**
	 *  Filtro Estatico
	 *  
	 *  Calculamos la lista de antenas validas: Aquellas que no tengan asocada ninguna campaña o que la campaña que tienen asociada sea la actual.
	 */
	
	$scope.staticValidFilter = function(){
		console.log("staticValidFilter");
		$scope.AntennasKeyListValid = [];
		for(key in $scope.antennasSchedulesMap){
			//value = ARRAY[{"campaignId" :id "scheduleId": [id,...]}]
			var value = $scope.antennasSchedulesMap[key];
			var valid = true;
			if(value.length > 1){
				valid = false;
			}else if(value.length  == 1){
				if(value[0].campaignId  != $scope.tmpCampaign.id) 
					valid = false;
			}
			if(valid) $scope.AntennasKeyListValid.push(key);
		}
		$scope.calculateAntennasKeyListAvailable();
	};
	
	/**
	 *  Filtro Dinamico
	 *  
	 *  Calculamos la lista de antenas válidas: Aquellas que no tengan asocada ninguna campaña o
	 *  										   Aquellas que tengan un schedule valido con el evento actual;
	 */
	$scope.dynamicValidFilter = function(){
		console.log("dynamicValidFilter");

		$scope.AntennasKeyListValid = [];
		/*antennasSchedulesMap;
		$scope.AntennasKeyListValid;
		tmpCampaign.id;
		tmpCampaign.getSchedulesList()[0];*/
		
		//Creamos la lista de eventos de la campaña actual
		var schedules = [];
		var comprobarEventos = false;
		if($scope.tmpCampaign.getSchedulesList().length > 0){
			$scope.tmpCampaign.getSchedulesList().forEach(function(scheduleId){
				var schedule = $scope.scheduleList[scheduleId];
				schedules.push({start: schedule.dateIni, end:schedule.dateEnd, allDay: schedule.allDay});
			});
			
			if(schedules.length >0) 
				comprobarEventos = true;
		}
		//Recorremos la lista de campañas y schedules asociada a cada antena
		
		for(key in $scope.antennasSchedulesMap){
			//value = ARRAY[{"campaignId" :id "scheduleId": [id,...]}]
			var valid = true; //Supenemos que la antena cumple las condiciones, debemos comprobar si realmente las cumple.
			var value = $scope.antennasSchedulesMap[key];
			console.log(key + " - " + value);
			//Por cada antena, debemos recorrer cada una de las campañas que tiene
			value.forEach(function(antennaAsociateInfo){
				if(antennaAsociateInfo.campaignId != $scope.tmpCampaign.id){
					var camp = $scope.campaignsMap[antennaAsociateInfo.campaignId];
					if(!camp.dynamicMode){
						valid = false;
					}else{
						if(antennaAsociateInfo.scheduleId != undefined && comprobarEventos){
							var schedule = $scope.scheduleList[antennaAsociateInfo.scheduleId];
							var eventValidator = new EventValidator(schedules,{start: schedule.dateIni, end:schedule.dateEnd, allDay: schedule.allDay});
							if(!eventValidator.isValid())
									valid = false;
						}
					}
				}
			});
			if(valid) $scope.AntennasKeyListValid.push(key);
		}
		$scope.calculateAntennasKeyListAvailable();
	};
	
	/**
	 *  Calcula lista de antenas disponibles
	 *  
	 *  Antenas disponibles = antenas validas - antenas seleccionadas;
	 *  
	 */
	$scope.calculateAntennasKeyListAvailable = function(){
		var mapa = {};
		$scope.AntennasKeyListAvailable = [];
		$scope.AntennasKeyListValid.forEach(function(id){
			mapa[id] = true;
		});
		
		$scope.AntennasKeyListSelected.forEach(function(id){
			mapa[id] = false;
		});
		
		for(key in mapa){
			if(mapa[key]) $scope.AntennasKeyListAvailable.push(key);
		}
	};
	
	$scope.optionsInfocard = {};
	$scope.optionsInfocard.optInfo; 
	$scope.optionsAntennas = {};
	$scope.optionsAntennas.optAnt; 
	$scope.bmInfo = false;
	$scope.bmTitle = false;
	$scope.bmAnt = false;
	/*String*/ $scope.tmpCampaign.name = "";
	/*String*/ $scope.urlImg 	= "";
	/*String*/ $scope.txtTitle = ""; 
	/*String*/ $scope.txtDescription = "";
	/*List*/   $scope.AntennasKeyListSelected = []; 
	/*bool*/   $scope.oculto = false;
	/*bool*/   $scope.bm1 = false;
	/*bool*/   $scope.boton = true;
	/*bool*/   $scope.tmpCampaign.dynamicMode = false;
	
	

    $scope.datepicker = {};
    var fechaactual = new Date();
    	var dia = fechaactual.getDate();
	var mes = fechaactual.getMonth();
	var anio = fechaactual.getFullYear();
	      
	$scope.editingEvent = false;
	$scope.timepicker = {};
	$scope.timepicker.myTime = new Date();
	$scope.timepickerEnd = {};
	$scope.timepickerEnd.myTimeEnd = new Date();
	
	$scope.loadDataView = function(){

			if($scope.tmpCampaign.id != ""){
				/*String*/ $scope.optionsInfocard.optInfo = $scope.infoCardsMap[$scope.tmpCampaign.infocardId];
				/*String*/ $scope.urlImg 	= $scope.infoCardsMap[$scope.tmpCampaign.infocardId].urlImg;
				/*String*/ $scope.txtTitle = $scope.infoCardsMap[$scope.tmpCampaign.infocardId].title; 
				/*String*/ $scope.txtDescription = $scope.infoCardsMap[$scope.tmpCampaign.infocardId].description;
				 /*bool*/  $scope.oculto = true;
				 /*bool*/  $scope.boton = false;
			}

			$scope.myswitch = 'off';
			$scope.changeDynamicMode($scope.tmpCampaign.dynamicMode);
			$scope.tmpCampaign.dynamicMode ? $scope.myswitch = 'on' : $scope.myswitch = 'off';
			
			$scope.changeViews = function(){
				$scope.show == true ? $scope.show = false : $scope.show = true;
			};
			
			// Eventos del Calendario
			/* event source that contains custom events on the scope */
		
			///
		
			$scope.tmpschedule = new Schedule();
			if($scope.tmpCampaign.getSchedulesList().length > 0){   // La campaña ya tiene asignada un Schedule
				sid = $scope.tmpCampaign.getSchedulesList()[0];
				 asm.getEntityOfKindById(Schedule.entityKind,sid)
					.then(function(entity){
						if(entity != null){
								$scope.tmpschedule.initFromEntity(entity);
								//transformación
								$scope.eventSources[$scope.calEvents][$scope.actualEvent] = {};
								$scope.eventSources[$scope.calEvents][$scope.actualEvent].title = $scope.tmpschedule.name;
								$scope.eventSources[$scope.calEvents][$scope.actualEvent].start = moment($scope.tmpschedule.dateIni);
								$scope.eventSources[$scope.calEvents][$scope.actualEvent].end = moment($scope.tmpschedule.dateEnd);
								$scope.eventSources[$scope.calEvents][$scope.actualEvent].allDay = $scope.tmpschedule.every;
								
								
						}
					}).done();
				
			}else{  // La campaña no tiene asignada un Schedule
				
				$scope.tmpschedule.init({});
				$scope.tmpschedule.name = "";
				$scope.tmpschedule.dateIni = "";
				$scope.tmpschedule.dateEnd = "";
				$scope.tmpschedule.every = "";
			}
			
		
				$scope.$watch('myswitch', function(newValue, oldValue) {
					console.log(newValue);
					if(newValue == 'on') $scope.changeDynamicMode(true);
					if(newValue == 'off') $scope.changeDynamicMode(false);
				});
		
			 	$scope.$watch('tmpCampaign.name', function(newValue, oldValue) {
			 		$scope.tmpCampaign.name = newValue;
			 		$scope.tmpCampaign.name.length >= 5 ? $scope.btn = true : $scope.btn = false;
			 		$scope.tmpCampaign.name.length >= 5 ? $scope.bmTitle = true : $scope.bmTitle = false;
			 		$scope.path[1].name = $scope.tmpCampaign.name;
			 		
		        });
			 	
			 	$scope.$watch('optionsInfocard.optInfo', function(selectedObject) 
			 	 {
			 		if(selectedObject != undefined && selectedObject != ""){
				 		$scope.urlImg = selectedObject.urlImg;
				 		$scope.txtTitle = selectedObject.title;
				 		$scope.txtDescription = selectedObject.description;
				 		$scope.tmpCampaign.infocardId = selectedObject.id;
				 		$scope.bmInfo = true;
			 		}
		        });
		
			 	$scope.actualizarName = function(){
					console.log("actualizarName()");
			 		$scope.tmpCampaign.name.length >= 5 ? $scope.bm1 = true : $scope.bm1 = false;
			 		$scope.generarboton();
			 	};
			 	
			 	$scope.generarboton = function(){
		
					console.log("generarboton()");
			 		$scope.bm1 ? $scope.boton = false : $scope.boton = true;
			 	}; 
			 	
			 	$scope.AntennasKeyListAvailable.length == 0 ? $scope.viewAnt = false : $scope.viewAnt = true;
			 	
			 	$scope.$watch('optionsAntennas.optAnt', function(selectedObject) {
			 				console.log("$watch('optionsAntennas.optAnt')");
			 		 		if(selectedObject != "" && selectedObject != undefined && selectedObject != null)
			 		 			{
			 		 				$scope.AntennasKeyListSelected.push(selectedObject);
							 		var j = $scope.AntennasKeyListAvailable.indexOf(selectedObject);
							 		if(j != -1){ $scope.AntennasKeyListAvailable.splice(j,1);}
							 		$scope.AntennasKeyListAvailable.length == 0 ? $scope.viewAnt = false : $scope.viewAnt = true;
							 		$scope.updateCalendarForCampaignAntenas();
			 		 			};
			 	});
			 	
		
				 $scope.deleteAnt = function(Ant){
					 console.log("deleteAnt()");
					 	$scope.AntennasKeyListAvailable.push(Ant);
					 	$scope.viewAnt = true;
					 	var i = $scope.AntennasKeyListSelected.indexOf(Ant);
					 	if(i != -1)
					 		{
					 			$scope.AntennasKeyListSelected.splice(i, 1);
					 			//Asignar al calendario
					 		}
					 	$scope.updateCalendarForCampaignAntenas();
					 	$scope.optionsAntennas.optAnt = "";
				 	};
				 
		
				 $scope.showCalendar = function(){
					 console.log("showCalendar()");
					 $scope.bmInfo && $scope.bmTitle ? $scope.infoCalendar = false : $scope.infoCalendar = true; 
				};
					 
					 
			
							 
				 	
			  /****************************************** CALENDAR FUNCTION ***************************************/
		
			      /* add custom event*/
				/**
				 *  @param start : objeto moment
				 *  @param end : objeto moment
				 */
			      $scope.addEvent = function(start, end, allDay, jsEvent, view ) {
			    	  	console.log("addEvent()");
			    	  	if(!$scope.editingEvent){
				    	  	$scope.editingEvent = true;
				    	  	
				    	  	if(start != undefined && end != undefined && $scope.tmpCampaign.name != undefined){
						    	  var eventValidator = new EventValidator($scope.eventSources[$scope.calEventsExt],{start: start, end: end, allday: $scope.datosEvents.allDay});
						    	  
						    	  if($scope.eventSources[$scope.calEvents].length == 0){
						    		  console.log("no había evento, pero ahora si");
						    		  $scope.eventSources[$scope.calEvents][$scope.actualEvent] = {};
						    	  } 
						    	  
						    	  if($scope.datosEvents.allDay){
								    	  if(eventValidator.isValid()){
									    		  $scope.showConflict = false;
									    		  $scope.eventSources[$scope.calEvents] = [{}];
									    		  var n = $scope.eventSources[$scope.calEvents].length-1;
									    		  if($scope.tmpCampaign.title == ""){
										    		  $scope.eventSources[$scope.calEvents][n].title = "Campaña";
									    		  }else{
										    		  $scope.eventSources[$scope.calEvents][n].title = $scope.tmpCampaign.name;
									    		  }
									    		  $scope.eventSources[$scope.calEvents][n].title = $scope.tmpCampaign.name;
									   	      $scope.eventSources[$scope.calEvents][n].start = start;
									   	      $scope.eventSources[$scope.calEvents][n].end = end;
									   	      $scope.eventSources[$scope.calEvents][n].allDay = $scope.datosEvents.allDay;
									   	     
									   	      //if($scope.datepickerend.dtend == undefined || $scope.datepickerend.dtend == "") $scope.datepickerend.dtend = $scope.datepicker.dt }
									   	      
									   	      $scope.datepicker.dt = start.toDate();
											  $scope.datepickerend.dtend = end.toDate();
								    	  	
								    	  }else{
								    		  // mostrar un mensaje de información diciendo que el evento ya esta asignado
								    		  $scope.showConflict = true;
								    	  }
								      
							  }
				    		  }	
				    	  	$scope.updateCalendar();
				    	  	$timeout(function(){$scope.editingEvent = false;},300,true);
			      	}
			      };
			      
			      
			      
			      /* remove event */
			      $scope.replaceEvent = function() {
			    	  	console.log("replaceEvent()");
			    		if($scope.events.length == 2) $scope.events.splice(0, 1);
			    		$scope.$apply();
			     };
			      
			      $scope.deleteEvents = function(){
		
			    	  	  console.log("deleteEvents()");
				    	  $scope.datepicker.dt = new Date();
			
				    	  $scope.datepickerend.dtend =  null;
				    	  $scope.events.splice(0, 1);
				    	  $scope.showDelete = false;
			      };
		
			      
		
			    $scope.eventUpdate = function(event, delta, revertFunc, jsEvent, ui, view){
			    			console.log("eventResize()");
			    			var eventValidator = new EventValidator($scope.eventSources[$scope.calEventsExt],event);
					    	 if(eventValidator.isValid()){
					    		 	editingEvent = true;
					    		 	$scope.eventSources[$scope.calEvents][$scope.actualEvent].start = event.start;
					    		 	$scope.eventSources[$scope.calEvents][$scope.actualEvent].end = event.end;
					    		 	$scope.showConflict = false;
					    		  	$scope.btncalen = true;
					    		  	$scope.datepicker.dt = event.start.toDate();
					    		  	$scope.datepickerend.dtend = event.end.toDate();
					    		  	$timeout(function(){$scope.editingEvent = false;},300,true);
					    	  }else{
					    		  revertFunc();
					    	  }
			      };
				      	      

			      $scope.selectableEvents = function(){
			    	  		console.log("selectableEvents()");
			    	  		$scope.uiConfig.calendar.selectable = true;
			      };
			      
				  $scope.changeView = function(view,calendar) {
					  	console.log("changeView()");
				        calendar.fullCalendar('changeView',view);
				  };
			      
			       
		          $scope.$watch("datepicker.dt",function(newValue,oldValue){
				        	
		          		console.log("$watch(datepicker.dt)");
		           		 $scope.fechaminend = $scope.datepicker.dt.getFullYear()+"-"+($scope.datepicker.dt.getMonth()+1)+"-"+$scope.datepicker.dt.getDate();
		           		 $scope.datepickerend.minDateEnd = $scope.fechaminend;
		          		 //newValue == oldValue ? $scope.toggleMin() : "";
		          		 $scope.formats = ['dd-MMMM-yyyy'];
		          		 $scope.format = $scope.formats[0];
		          		 
		          		 if(!$scope.editingEvent){
					    	  	 $scope.editingEvent = true;
					    	  		
			          		 if($scope.eventSources[$scope.calEvents][$scope.actualEvent] != undefined){
			          			 console.log("datepicker.dt newValue");
			          			 $scope.eventSources[$scope.calEvents][$scope.actualEvent].start = moment(newValue);
			          		 }else{
			          			 /**
			          			  * TODO: Crear el evento actual
			          			  */
			          			$scope.eventSources[$scope.calEvents][$scope.actualEvent] = {};
			          			 
			          		 }
			          		 
			          		$scope.updateCalendar();
					    	  	$scope.editingEvent = false;
				      	}
		          	});
		          	
		          	  $scope.toggleMin = function() {
		 	    	    $scope.datepicker.minDate = $scope.datepicker.minDate ? null : new Date();
		 	    	  };
			    	
			    	  $scope.updateMinDateEnd = function(){
			    		  console.log("updateMinDateEnd()");
			    		  $scope.fechaminend = $scope.datepicker.dt.getFullYear()+"-"+($scope.datepicker.dt.getMonth()+1)+"-"+$scope.datepicker.dt.getDate();
				    	  $scope.datepickerend.minDateEnd = $scope.fechaminend;
			    	  };
			    	  
			    	  $scope.open = function($event) {
		
			    		  	console.log("open()");
				    	    $event.preventDefault();
				    	    $event.stopPropagation();
				    	    $scope.datepicker.opened = true;
				    	    $scope.datepickerend.openedEnd = false;
				    	    $scope.btncalen = false;
				    	  };
			    	 
			    	  /* FECHA FINAL */
			    	  $scope.datepickerend = {};
			    	  $scope.tmpschedule.dateEnd == "" ? $scope.datepickerend.dtend = new Date($scope.datepicker.dt) : $scope.datepickerend.dtend = new Date($scope.tmpschedule.dateEnd);
			    	  
			    	  $scope.$watch("datepickerend.dtend",function(newValue,oldValue){
			    			
				    		  console.log("$watch(datepickerend.dtend)");
				    		  $scope.fechamaxend = $scope.datepickerend.dtend.getFullYear()+"-"+($scope.datepickerend.dtend.getMonth()+1)+"-"+$scope.datepickerend.dtend.getDate();
				    		  $scope.datepicker.maxDate = $scope.fechamaxend;
				    		  //newValue == oldValue ? "" : $scope.toggleMax();
				    		  $scope.formats = ['dd-MMMM-yyyy'];
					    	  $scope.format = $scope.formats[0];
					    	  
						  if(!$scope.editingEvent){
						    	  	$scope.editingEvent = true;
						    	  	$scope.eventSources[$scope.calEvents][$scope.actualEvent].end = moment(newValue);
						    	  	$scope.updateCalendar();
						    	  	$scope.editingEvent = false;
					      }
			    	  });
			    	  
			    	  $scope.toggleMax = function() {
			    		    console.log("toggleMax()");
				    	    $scope.datepicker.maxDate = $scope.datepicker.maxDate;
				    	};
				      
			    	  
			    	  $scope.openEnd = function($event) {
			    		  console.log("openEnd()");
			    	    $event.preventDefault();
			    	    $event.stopPropagation();
			    	    $scope.datepickerend.openedEnd = true;
			    	    $scope.datepicker.opened = false;
			    	  };
		
			    	  
			    	   $scope.tmpschedule.dateIni == '1970-01-01T00:00:00.000Z' ? $scope.datepicker.dt = new Date(anio,mes,dia) : $scope.datepicker.dt = new Date($scope.tmpschedule.dateIni);
			       	     
			    	  
			    /************ END DATEPICKER *************/	  
			    	  
			  /************ TIMEPICKER *************/	 
			    	  
			    	  
			    	  
			    	  $scope.openTime = function($event) {
			    	    $event.preventDefault();
			    	    $event.stopPropagation();
		
			    	    $scope.timepicker.openedTime == true ?  $scope.timepicker.openedTime = false :  $scope.timepicker.openedTime = true;
			    	    $scope.timepickerEnd.openedTimeEnd = false;
			    	  };  
			    	  
			    	  
			    	  
			    	  $scope.openTimeEnd = function($event) {
			    	    $event.preventDefault();
			    	    $event.stopPropagation();
		
			    	    $scope.timepicker.openedTime = false;
			    	    $scope.timepickerEnd.openedTimeEnd == true ?  $scope.timepickerEnd.openedTimeEnd = false :  $scope.timepickerEnd.openedTimeEnd = true;
			    	    
			    	  };  
			    	  
			    	  
			  /************ END TIMEPICKER *************/	  
			    	  
				      
				      $scope.$watch('datosEvents.allDay',function(newValue,oldValue){  
				    	  	$scope.showError = false; 
				    	  	$scope.datosEvents.allDay.valueOf() ? $scope.showTime = false : $scope.showTime = true;
				      });
				      
				    $scope.saveCampaign = function(){
				    			console.log("saveCampaign");
				    			$scope.visibility.botonLoading = true;
				    			json = JSON.stringify($scope.AntennasKeyListSelected);
				    			$scope.tmpCampaign.antennasList = JSON.parse(json);
						    	if($scope.tmpCampaign.dynamicMode){ 
						    		//Asignacion de valores
						    		//$scope.visibility.visible = false;
						    		//$scope.visibility.botonLoading = true;	
						    			$scope.tmpschedule.name = $scope.eventSources[$scope.calEvents][$scope.actualEvent].title;
						    			$scope.tmpschedule.dateIni = $scope.eventSources[$scope.calEvents][$scope.actualEvent].start.toDate();
						    			$scope.tmpschedule.dateEnd = $scope.eventSources[$scope.calEvents][$scope.actualEvent].end.toDate();
						    			$scope.tmpschedule.every = $scope.eventSources[$scope.calEvents][$scope.actualEvent].allDay;
							    		$scope.tmpschedule.save().then(function(mapa){
							    			
						    				var encontrado = false;
						    				console.log($scope.tmpCampaign.getSchedulesList());
						    				for(sid in $scope.tmpCampaign.getSchedulesList()){
						    					if(sid == $scope.tmpschedule.id) encontrado = true;
						    				}
						    				
						    				if(!encontrado) $scope.tmpCampaign.addScheduleToList($scope.tmpschedule.id);
						    				
						    				console.log($scope.tmpCampaign.getSchedulesList());
						    				$scope.tmpCampaign.save().then(function(mapa){
								    			$scope.originalCampaign = new Campaign();
								    			$scope.originalCampaign.initFromCache($scope.tmpCampaign.json());
								    			$scope.visibility.botonLoading = false;
								    			$scope.$apply();
								    		}).done();
						    				
							    		}).done();
								
						    	}else{
						    		$scope.tmpCampaign.save().then(function(mapa){
						    			$scope.originalCampaign = new Campaign();
						    			$scope.originalCampaign.initFromCache($scope.tmpCampaign.json());
						    			$scope.visibility.botonLoading = false;
						    			$scope.$apply();
						    		}).done();
						    		//$modalInstance.close(tmpCampaign); Salvado
						    	}
				    }; 
					 	
				    	$scope.cancel = function () {
				    		console.log("cancel()");
				  	    //$modalInstance.dismiss('cancel');
				  	 };	
				  	 
				  	 
				 	/* config object */
				     $scope.uiConfig = {
				       calendar:{
				         select: $scope.addEvent,
				         height: 514,
				         editable: true,
				         defaultView : "month",
				         header:{
				           left: 'agendaWeek agendaDay month',
				           center: 'title',
				           right: 'today prev,next'
				         },
				         selectable: true,
				 		  firstDay: 1,
				 		  eventResize: $scope.eventUpdate,
				 		  eventDrop : $scope.eventUpdate,
				       }
				     };
				     
				     if(!$scope.phase2){
				   	  	$scope.uiConfig.calendar.header.left = '';
				     }

				     $scope.uiConfig.calendar.monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
				     $scope.uiConfig.calendar.monthNamesShort = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
				     $scope.uiConfig.calendar.dayNames = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
				     $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];


				  	 $scope.$apply();  
	};			  	 
		  	
	
	$scope.load = function(){
		
		  	$scope.loadEntities();
		  		 
		  	 /**
		  	  * Chart Data
		  	  */ 
		  	$scope.chartObject = {
		  		  "type": "AreaChart",
		  		  "displayed": true,
		  		  "data": {
		  		    "cols": [
		  		      {
		  		        "id": "month",
		  		        "label": "Month",
		  		        "type": "string",
		  		        "p": {}
		  		      },
		  		      {
		  		        "id": "all-users",
		  		        "label": "Total usuarios",
		  		        "type": "number",
		  		        "p": {}
		  		      },
		  		      {
		  		        "id": "users",
		  		        "label": "Usuarios interesados",
		  		        "type": "number",
		  		        "p": {}
		  		      }
		  		    ],
		  		    "rows": [
		  		      {
		  		        "c": [
		  		          {
		  		            "v": "Lunes"
		  		          },
		  		          {
		  		            "v": 340,
		  		            "f": "340 Usuarios detectaron esta información"
		  		          },
		  		          {
		  		            "v": 124,
		  		            "f": "124 usuarios se interesaron por la información"
		  		          }
		  		        ]
		  		      },
		  		      {
			  		        "c": [
			  		          {
			  		            "v": "Martes"
			  		          },
			  		          {
			  		            "v": 105,
			  		            "f": "105 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 48,
			  		            "f": "48 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		 {
			  		        "c": [
			  		          {
			  		            "v": "Miércoles"
			  		          },
			  		          {
			  		            "v": 89,
			  		            "f": "89 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 36,
			  		            "f": "36 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		 {
			  		        "c": [
			  		          {
			  		            "v": "Jueves"
			  		          },
			  		          {
			  		            "v": 185,
			  		            "f": "185 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 65,
			  		            "f": "65 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		{
			  		        "c": [
			  		          {
			  		            "v": "Viernes"
			  		          },
			  		          {
			  		            "v": 250,
			  		            "f": "250 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 160,
			  		            "f": "160 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		{
			  		        "c": [
			  		          {
			  		            "v": "Sábado"
			  		          },
			  		          {
			  		            "v": 545,
			  		            "f": "545 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 289,
			  		            "f": "289 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		{
			  		        "c": [
			  		          {
			  		            "v": "Domingo"
			  		          },
			  		          {
			  		            "v": 369,
			  		            "f": "369 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 198,
			  		            "f": "198 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
		  		    ]
		  		  },
		  		  "options": {
		  		    "title": "Metricas de la semana",
		  		    "isStacked": "false",
		  		    "fill": 20,
		  		    "displayExactValues": true,
		  		    "vAxis": {
		  		      "title": "Número de usuarios",
		  		      "gridlines": {
		  		        "count": 10
		  		      }
		  		    },
		  		    "hAxis": {
		  		      "title": "Día de la semana"
		  		    },
		  		    "lineWidth": 3,
		  		    "colors" :['#1c91c0','#5bb85b']
		  		  },
		  		  "formatters": {}
		  		};
	};
		  	
	$scope.load();


	
	$scope.lineDataset = {
		    labels : ["Lunes","Martes","Miércoles","Jueves","Viernes","Sabado","Domingo"],
		    datasets : [
		        {
		        		label: "Usuarios totales",
		            fillColor: "rgba(220,220,220,0.2)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [65, 59, 80, 81, 56, 55, 90]
		        },
		        {
		            label: "Usuarios activos",
		            fillColor: "rgba(0,220,97,0.2)",
		            strokeColor: "rgba(0,195,86,0.7)",
		            pointColor: "rgba(10,195,86,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [28, 48, 48, 58, 34, 27, 40]
		        }
		    ]
		  };
	
	$scope.map = {
			center: {latitude: 40.358650, longitude: -3.69030 },
		 	zoom: 18,
		 	events: {
				    tilesloaded: function (map) {
					    		$scope.mapInstance = map;
				    }
			}
	};
	
	$scope.options = {
	        scrollwheel: false,
	        panControl: true,
	        streetViewControl: false,
	        zoomControlOptions : {
	          style: "SMALL"
	        }
	};
	
	$scope.marker = {
	      id:0,
	      coords: {
	     	    latitude: 40.358650,
	          longitude: -3.69030
	      },
	      options: { draggable: true },
	      title: "Antena Fibity",
	      icon: fibity.manager.path + "/images/fibity_marker.png",
	      events: {
	          dragend: function (marker, eventName, args) {
	          		$scope.markerLocation.latitude = marker.getPosition().lat();
	          		$scope.markerLocation.longitude = marker.getPosition().lng();
	              	$scope.$apply();
	          }
	      }
	};
	
}]);


