/*consume BitWheater un Wheater Underground API to check, on bologna,
 the temperature to trigger some action on other things at home
 like air conditioner fan and other
*/

  WoTHelpers.fetch("coap://localhost:5683/wheater_misuration_from_wheaterUnderground").then(async (td) => {
    // using await for serial execution (note 'async' in then() of fetch())
    try {
        let thing = await WoT.consume(td);
        console.info("=== TD ===");
        console.info(td);
        console.info("==========");
        // // read property #1
        let lat =  await thing.readProperty("lat");
        let lon = await thing.readProperty("lon");
        //check for the zone
        let imperial = await thing.readProperty("imperial");
        var temperature = imperial["tempAvg"] - 32 * 5)/9)

        console.info("BIT wheaterUnderground");
        console.info(temperature);

        /*if(temperature > 27){
          console.info("27 under");

          WoTHelpers.fetch("coap://localhost:5683/conditioner").then(async (td) => {
            await thing.invokeAction("turnOn");
          }).catch((err) => { console.error("Fetch error:", err); });

        }
        else{
          console.info("meno 27 under");

          WoTHelpers.fetch("coap://localhost:5683/conditioner").then(async (td) => {
            await thing.invokeAction("turnOff");
          }).catch((err) => { console.error("Fetch error:", err); });
        }*/
        // console.info("count value is", read1);
        // // increment property #1 (without step)
        // await thing.invokeAction("increment");
        // let inc1 = await thing.readProperty("count");
        // console.info("count value after increment #1 is", inc1);
        // // increment property #2 (with step)
        // await thing.invokeAction("increment", undefined, { uriVariables: { 'step': 3 } });
        // let inc2 = await thing.readProperty("count");
        // console.info("count value after increment #2 (with step 3) is", inc2);
        // // decrement property with formIndex == 2
        // await thing.invokeAction("decrement", undefined, { formIndex: 2 });
        // let dec1 = await thing.readProperty("count");
        // console.info("count value after decrement is", dec1);
    }
    catch (err) {
        console.error("Script error:", err);
    }
}).catch((err) => { console.error("Fetch error:", err); });

WoTHelpers.fetch("coap://localhost:5683/wheater_misuration_from_Bit_Wheater").then(async (td) => {
    // using await for serial execution (note 'async' in then() of fetch())
    try {
        let thing = await WoT.consume(td);
        console.info("=== TD ===");
        console.info(td);
        console.info("==========");
        // let read1 = await thing.readProperty("count");
        // read property #1
        let lat =  await thing.readProperty("lat");
        let lon = await thing.readProperty("lon");

        //check for the zone
        let temperature = await thing.readProperty("temp");
        console.info("BIT WHEATER");
        console.info(temperature);

      /*  if(temperature > 27){
          console.info("27bit");

          WoTHelpers.fetch("coap://localhost:5683/conditioner").then(async (td) => {
            await thing.invokeAction("turnOn");
          }).catch((err) => { console.error("Fetch error:", err); });

        }
        else{
          console.info("meno 27bit");

          WoTHelpers.fetch("coap://localhost:5683/conditioner").then(async (td) => {
            await thing.invokeAction("turnOff");
          }).catch((err) => { console.error("Fetch error:", err); });
        }*/


        // console.info("count value is", read1);
        // // increment property #1 (without step)
        // await thing.invokeAction("increment");
        // let inc1 = await thing.readProperty("count");
        // console.info("count value after increment #1 is", inc1);
        // // increment property #2 (with step)
        // await thing.invokeAction("increment", undefined, { uriVariables: { 'step': 3 } });
        // let inc2 = await thing.readProperty("count");
        // console.info("count value after increment #2 (with step 3) is", inc2);
        // // decrement property with formIndex == 2
        // await thing.invokeAction("decrement", undefined, { formIndex: 2 });
        // let dec1 = await thing.readProperty("count");
        // console.info("count value after decrement is", dec1);
    }
    catch (err) {
        console.error("Script error:", err);
    }
}).catch((err) => { console.error("Fetch error:", err); });
