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
	

	
	
	