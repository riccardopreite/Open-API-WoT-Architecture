const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "yourPusherAppId",
  key: "yourPusherKey",
  secret: "yourPusherSecret",
  cluster: "eu",
  useTLS: true
});

var WoT;
module.exports = {
  startService: function startService(wot){
    WoT = wot
  },
  /********************
    FETCHING API SERVICE SOCKET MESSAGE
  ********************/
  receivedGetApiRequest: async function receivedGetApiRequest(){
    pusher.trigger("my-channel", "receivedGetApiRequest", {
      message: "server received request to retreive API"
    });
  },
  fetchingApi: async function fetchingApi(){
    pusher.trigger("my-channel", "fetchingApi", {
      message: "server is fetching API"
    });
  },
  fetchedApi: async function fetchedApi(){
    pusher.trigger("my-channel", "fetchedApi", {
      message: "server fetched API"
    });
  },
  /********************
    CREATING SERVICE SOCKET MESSAGE
  ********************/
  receivedAddingRequest: async function receivedAddingRequest(requestName){
    pusher.trigger("my-channel", "receivedAddingRequest", {
      message: "server received request to create service: " + requestName
    });
  },
  creatingService: async function creatingService(requestName){
    pusher.trigger("my-channel", "creatingService", {
      message: "server is creating file for service: " + requestName
    });
  },
  updatingTDCreating: async function updatingTDCreating(requestName){
    pusher.trigger("my-channel", "updatingTDCreating", {
      message: "server is updating TD for service: " + requestName
    });
  },
  updatedTDCreating: async function updatedTDCreating(requestName){
    pusher.trigger("my-channel", "updatedTDCreating", {
      message: "server has updated TD for service: " + requestName
    });
  },
  settlingPropCreating: async function settlingPropCreating(requestName){
    pusher.trigger("my-channel", "settlingPropCreating", {
      message: "server is settling up properties for service: " + requestName
    });
  },
  settledPropCreating: async function settledPropCreating(requestName){
    pusher.trigger("my-channel", "settledPropCreating", {
      message: "server has settled up properties for service: " + requestName
    });
  },
  writingFileCreating: async function writingFileCreating(requestName){
    pusher.trigger("my-channel", "writingFileCreating", {
      message: "server is writing file for service: " + requestName
    });
  },
  /********************
    DELETING SERVICE SOCKET MESSAGE
  ********************/
  receivedDeletingRequest: async function receivedDeletingRequest(requestName){
    pusher.trigger("my-channel", "receivedDeletingRequest", {
      message: "server received request to delete service: " + requestName
    });
  },
  delitingService: async function delitingService(requestName){
    pusher.trigger("my-channel", "delitingService", {
      message: "server is deliting service: " + requestName
    });
  },
  delitedService: async function delitedService(requestName){
    pusher.trigger("my-channel", "delitedService", {
      message: "server deleted service: " + requestName
    });
  },

  /********************
    EXECUTING SERVICE SOCKET MESSAGE
  ********************/
  receivedGeneralRequest: async function receivedGeneralRequest(requestName){
    pusher.trigger("my-channel", "receivedGeneralRequest", {
      message: "server received request to execute " + requestName
    });
  },
  fetchingData: async function fetchingData(requestName){
    pusher.trigger("my-channel", "fetchingData", {
      message: "fetching data for " + requestName
    });
  },
  settledUpService: async function settledUpService(requestName){
    pusher.trigger("my-channel", "settledUpService", {
      message: "data has been fetched for " + requestName
    });
  },
  executingService: async function executingService(requestName){
    pusher.trigger("my-channel", "executingService", {
      message: "executing " + requestName
    });
  },
  executedService: async function executedService(requestName){
    pusher.trigger("my-channel", "executedService", {
      message: "executed " + requestName
    });
  },

  /********************
    MOTOR SERVICE SOCKET MESSAGE
  ********************/
  motorStarted: async function motorStarted(){
    pusher.trigger("my-channel", "motorStarted", {
      message: "the motor started running"
    });
  },
  motorHalfRun: async function motorHalfRun(){
    pusher.trigger("my-channel", "motorHalfRun", {
      message: "the motor is at half stroke"
    });
  },
  /********************
    LCD SERVICE SOCKET MESSAGE
  ********************/
  lcdConnected: async function lcdConnected(){
    pusher.trigger("my-channel", "lcdConnected", {
      message: "the server connected to the lcd"
    });
  },
  lcdReceivedString: async function lcdReceivedString(text){
    pusher.trigger("my-channel", "lcdReceivedString", {
      message: "lcd received string: '" + text + "' to print"
    });
  },


  /********************
  FILTER SERVICE SOCKET MESSAGE
  ********************/
  filterCheckingLatLon: async function filterCheckingLatLon(lat,lon){
    pusher.trigger("my-channel", "filterCheckingLatLon", {
      message: "server is checking lat: " + lat + ", lon: " + lon
    });
  }
  
}
