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
				if(serviceProp[serviceName][apiKey][index].includes('API')){
					toSplit = serviceProp[serviceName][apiKey][index].split('API');
					prop = toSplit[1];
				}
				else if(serviceProp[serviceName][apiKey][index].includes('motor')){
					prop = serviceProp[serviceName][apiKey][index].replace('motor','')
				}
				else if(serviceProp[serviceName][apiKey][index].includes('lcd')){
					prop = serviceProp[serviceName][apiKey][index].replace('lcd','')
				} 
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
					try{console.log('VALUE');console.log(value)
					if(apiKey == 'lcd'){
						eval(''+name+'='  +"'"+value+"'");
						name = value;
					}
					else{
						eval(''+name+'='+value);
						name = value;
					}}
					catch(e){console.log(e);}
			  }
		  }
		resolve('created var');
	}); 
},
provapollenvapor: function provapollenvapor(){
	return new Promise(async (resolve, reject) => {
		if( ambeepollenAPIgrass_pollen == ambeepollenAPIgrass_pollen && ambeepollenAPIweed_pollen == ambeepollenAPIweed_pollen && ambeepollenAPItree_pollen == ambeepollenAPItree_pollen && waterwaporAPIwater_vapor == waterwaporAPIwater_vapor ){
			let thenVal = await createService.printLcd(ambeepollenAPIgrass_pollen); 
			resolve(thenVal)
		} 
		else{
			let elseVal = 'service got else without an action inserted' 
			resolve(elseVal)
		}
	 });
} 
}