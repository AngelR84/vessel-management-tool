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