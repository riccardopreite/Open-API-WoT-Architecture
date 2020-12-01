var path = require('path');
var __dirname = path.resolve();
var axios = require("axios")
const fs = require('fs');
var jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/apiDict.json'));
var apiJson = JSON.parse(jsonFile);

/******************
 * 	MOTOR PIN USED
 * ***************/
var motorPlantPin=3;


/******************
 * 	HUMAN PIN USED
 * ***************/
var humanBodyPin=2;


/******************
 * 	LED PIN USED
 * ***************/
var led_pinGreenWeather=5;
var led_pinWhiteWeather=4;
var led_pinWhiteMotionCoat=6;
var led_pinGreenMotionUmbrella=7;

var lcdRs = 8,lcdEnd = 9, lcd4 = 4,lcd5 = 5,lcd6 = 6,lcd7 = 7,lcdBack = 10, lcdRows = 2, lcdCol = 16,lcdInterval;
var lcdVect = [lcdRs,lcdEnd,lcd4,lcd5,lcd6,lcd7]
var Servient = require("@node-wot/core").Servient
var Helpers = require("@node-wot/core").Helpers
var johnny_five=require("johnny-five");
var arduino_board;
const actionUtils = require(path.join(__dirname, '/thingUtils/actionUtils.js'))
const moving = require(path.join(__dirname, '/microcontroller/clientMoving.js'))
var exposer = require(path.join(__dirname, '/crawler/exposer.js'))
var pusherServer = require(path.join(__dirname, '/server/pusher/pusherServer.js'));
var led_GreenWeather, led_WhiteWeather, led_WhiteMotionCoat, led_GreenMotionUmbrella;

var WoT,WoTHelpers;

var rainSens, soilSens, motion, motorPlant,speed = 50,leds,lcd;
module.exports = {
  bootArduino: async function bootArduino(wot){
    WoT = wot
    moving.setVar(wot);
    var CoapClientFactory = require("@node-wot/binding-coap").CoapClientFactory
    let servient = new Servient();
    servient.addClientFactory(new CoapClientFactory(null));
    WoTHelpers = new Helpers(servient);
    exposer = require(path.join(__dirname, '/crawler/exposer.js'))
    pusherServer = require(path.join(__dirname, '/server/pusher/pusherServer.js'));

    //moving.checkWeatherTrafficIncidentMoving()
    arduino_board = new johnny_five.Board();
    arduino_board.on("ready", async function() {
     // ... the board is connected, and capabilities reported
      console.log("CONNECTED")
       lcd = new johnny_five.LCD({
		pins: lcdVect,
		backlight: lcdBack,
		rows: lcdRows,
		cols: lcdCol
	  });
	  lcd.clear().print("Hello!");

      /*rainSens = new johnny_five.Sensor({
        pin: "A0"
      });
      soilSens = new johnny_five.Sensor({
        pin: "A1"
      });*/
      motorPlant = new johnny_five.Motor({
		   pins: {
			pwm: motorPlantPin
		  }
	  });
	   arduino_board.repl.inject({
		motorPlant
		,lcd
	  });
      motion = new johnny_five.Motion(2);
      /*leds = new johnny_five.Leds([led_pinGreenWeather,led_pinWhiteWeather,led_pinWhiteMotionCoat,led_pinGreenMotionUmbrella]);
      leds.each((led, index) => {
        switch (index) {
          case 0:
          led_GreenWeather = led
          break;
          case 1:
          led_WhiteWeather = led
          break;
          case 2:
          led_WhiteMotionCoat = led
          break;
          case 3:
          led_GreenMotionUmbrella = led
          break;
          default:
        }
      });*/

      //EXPOSE LEDS
      //exposer.createComponentThing(led_pinWhiteWeather,"led","white")
      //exposer.createComponentThing(led_pinGreenWeather,"led","green")
      //exposer.createComponentThing(led_pinWhiteMotionCoat,"led","white")
      //exposer.createComponentThing(led_pinGreenMotionUmbrella,"led","green")

	  //EXPOSE LCD
	  let pinLCD = [lcdVect,lcdBack,lcdRows,lcdCol]
      exposer.createComponentThing(pinLCD,"lcd")

      //EXPOSE MOVE SENSOR
      exposer.createComponentThing(humanBodyPin,"humanBodySensor")

      //EXPOSE MOTOR
      exposer.createComponentThing(motorPlantPin,"motorPlant")

    });
    arduino_board.on("exit", function() {
		/*leds.each((led, index) => {
			led.stop()
			led.off()
		});*/
		lcd.clear();
		lcd.off().noBacklight();
		motorPlant.stop();
		console.log("EXIT BOARD - TURNED OFF LED")
    });
  },
  blinkLed : function blinkLed(pin,period){
	let led = getLed(parseInt(pin));

	if(parseInt(period) > 0 && led !== 0) {
		led.stop()
		led.blink(period)
		return 1;
	}
	else return 0;
  },
  turnOnLed : function turnOnLed(pin){
	let led = getLed(parseInt(pin));
	if(led === 0) return 0;
	led.stop()
	led.on();
	return 1;
  },
  turnOffLed : function turnOffLed(pin){
	let led = getLed(parseInt(pin));
	if(led === 0) return 0;
	led.stop()
	led.off();

	return 1;
  },
  calibrateSensor: async function calibrateSensor(thing){
	return new Promise(async (resolve, reject) =>  {
	  motion.on("calibrated", function() {
		console.log("calibrated");
		triggerMovement(thing)
		resolve(1);
	  });
	});
  },
  openPlant: function openPlant(thing){
	  return new Promise(async (resolve, reject) => {
		  motorPlant.start(215);
		  setTimeout(() => {
			try{
				motorPlant.stop()

				resolve(1)
			}
			catch(e){
				resolve(0)
			}
		  },2000)
	  });
  },
  coverPlant: function coverPlant(thing){
	  return new Promise(async (resolve, reject) => {

		  motorPlant.start(215);
		  setTimeout(() => {
			try{
				motorPlant.stop()

				resolve(1)
			}
			catch(e){
				resolve(0)
			}
		  },2000)
	  });
  },
  runMotor: function runMotor(thing){
	  return new Promise(async (resolve, reject) => {
		  motorPlant.start(215);
      console.log("Motor started");
      pusherServer.motorStarted()
      setTimeout(() => {
        console.log("Motor half run");
        pusherServer.motorHalfRun()
      },1000)
  		setTimeout(() => {
  			try{
  				motorPlant.stop()

  				resolve(1)
  			}
  			catch(e){
  				resolve(0)
  			}
      },1000)
	  });
  },
  print: function print(text,thing){
    console.log("connected to lcd");
    pusherServer.lcdConnected()
	  return new Promise(async (resolve, reject) => {
      try{
        console.log("received string " + text);
        pusherServer.lcdReceivedString(text)
        lcd.clear().setCursor(0,0).print(text)
        thing.writeProperty("text",text)
        resolve(1)
      }
      catch(e){
        resolve(0)
      }

	  });
  },
  communicateWeatherToArduinoMoving : function communicateWeatherToArduinoMoving(json){
	printToLcd(json)
  }
}
function getLed(pin){
	switch(pin){
		case led_pinWhiteWeather:
          return led_WhiteWeather;
          break;
		case led_pinGreenWeather:
          return led_GreenWeather;
          break;
        case led_pinWhiteMotionCoat:
          return led_WhiteMotionCoat;
          break;
        case led_pinGreenMotionUmbrella:
          return led_GreenMotionUmbrella;
          break;
        default:
		  return 0;
	}
}
async function triggerMovement(thing){
	motion.on("motionstart", async function() {
		console.log("releveted motion");
		thing.writeProperty("lastDetection",(new Date()).toISOString())
		thing.emitEvent("motionStarted",(new Date()).toISOString())
		let json = await moving.checkWeatherTrafficIncidentMoving()
		printToLcd(json)
	});

	  // "motionend" events are fired following a "motionstart" event
	  // when no movement has occurred in X ms
	motion.on("motionend", function() {
		console.log("motionend");
		thing.emitEvent("motionEnded",(new Date()).toISOString())
	  });
}

function printToLcd(json){
  var meteoType,windSpeed,traffic,incident,coat,umbrella;
  meteoType = json["weather"]["weather"]
  windSpeed = json["weather"]["wind"]
  traffic = json["traffic"]
  incident = json["incident"]

  switch(meteoType){
	case "typeSunny":
		coat = "no"
		umbrella = "no"
		break;
	case "typeCloudy":
		coat = "no"
		umbrella = "no"
		break;
	case "typeRain":
		coat = "si"
		umbrella = "si"
		break;
	case "typeHail":
		coat = "si"
		umbrella = "si"
		break;
	case "typeFog":
		coat = "no"
		umbrella = "no"
		break;
	case "typeSnow":
		coat = "si"
		umbrella = "si"
		break;
	}
	if(windSpeed>0.5) coat = "si"
	lcd.clear();
	var weather = "Meteo: " + meteoType.replace("type",""), wind = "Vento: " +  windSpeed.toFixed(2) + "kmh";
	var dress = "Giubotto: " + coat, umbrel =  "Ombrello: " +  umbrella
	var text = "Meteo: " + meteoType.replace("type","") + " Vento: " +  windSpeed + " Giubotto: " + coat+" Ombr: " +  umbrella
	var check = 0;
	try{
		clearInterval(lcdInterval)
	}
	catch(e){}
	lcdInterval = setInterval(async function(){
		if(!check){
			lcd.clear().setCursor(0,0).print(weather).setCursor(0,1).print(wind)
			check = 1
		}
		else{
			lcd.clear().setCursor(0,0).print(dress).setCursor(0,1).print(umbrel)
			check = 0
		}

	},5000);
	return text;
}
function communicateWeatherToArduinoMotor(meteoType,windSpeed){
  switch(meteoType){
	  //SE TROPPO POCO NON GIRA
	case "typeSunny":
	//inverti motore fino a pianta scoperta
	//togli telo macchina
	//apri tenda
		break;
	case "typeCloudy":
	//inverti motore fino a pianta scoperta
	//togli telo macchina
	//chiudi tenda
		break;
	case "typeRain":
	//inverti motore fino a pianta coperta
	//togli telo macchina
	//chiudi tenda
		break;
	case "typeHail":
	//inverti motore fino apianta coperta
	//metti telo macchina
	//apri tenda
		break;
	case "typeFog":
	//lascia pianta uguale
	//lascia macchina uguale
	//chiudi tenda
		break;
	case "typeSnow":
	//inverti motore fino a pianta coperta
	//metti telo macchina
	//chiudi tenda
		break;
 }

 if(windSpeed>0.5) {
	//chiudi tenda
 }
 else{
	 //lascia tenda uguale
 }
 var text = "Meteo: " + meteoType.replace("type","") + " Velocita vento: " +  windSpeed
 return text;
}


/*
rainSens.on("change", () => {
if(rainSens.value<400){
console.log("HEAVY RAIN");
led_GreenRain.on()
led_GreenRain.blink(100)
led_WhiteRain.stop()
led_WhiteRain.off()
}
else if(rainSens.value<600){
console.log("MODERATE RAIN");
led_WhiteRain.on()
led_GreenRain.stop()
led_GreenRain.off()
led_WhiteRain.blink(500)
}
else {
console.log("NO RAIN");
led_GreenRain.stop()
led_GreenRain.off()
led_WhiteRain.stop()
led_WhiteRain.off()
}
});

WsoilSens.on("change", () => {
if(1023 - soilSens.value < 512){
led_GreenSoil.on()
led_WhiteSoil.off()
}
else{
led_WhiteSoil.on()
led_GreenSoil.off()
}
});
*/
function motorControl(){
	setInterval(async function(){
		let json = await moving.checkWeatherMotor();
		communicateWeatherToArduinoMotor(json)
	},10000);
}
