var serviceTD={}, serviceProp={};
const path = require('path');
var createService = require(path.join(__dirname, '../createService/createServiceServer.js'));
module.exports={
setJson: async function setJson(serviceName){
	return new Promise(async (resolve, reject) => {
		serviceTD = createService.getServiceTD();
		serviceProp = createService.getServiceProp();
		 for(var apiKey in serviceTD[serviceName]){
			  for(var index in serviceProp[serviceName][apiKey]){
					let toSplit = serviceProp[serviceName][apiKey][index].split('API');
					let prop = toSplit[1];
					let properties = await serviceTD[serviceName][apiKey].readProperty(prop).then(async (properties) => {
							return new Promise(async (resolveProp, reject) => {
									resolveProp(properties);
							});
					});
					let name = String(serviceProp[serviceName][apiKey][index]);
					let value = '';
					if(typeof properties === 'object'){
							for(var key in properties){
									value = properties[key];
									break;
							}
					}
					else value = properties;
					try{
							eval(''+name+'='+value);
							name = value;
					}
					catch(e){console.log(e);}
			  }
		  }
		resolve('created var');
	}); 
},
prova3: function prova3(){
	return new Promise(async (resolve, reject) => {
		if( openAPItemperature == openAPItemperature ){
			let thenVal = await createService.filterPosition(44,11,1,'prova3','hereIncidentAPI'); 
			resolve(thenVal)
		} 
		else{
			let elseVal = await createService.printLcd(openAPItemperature); 
			resolve(elseVal)
		}
	 });
} 
}