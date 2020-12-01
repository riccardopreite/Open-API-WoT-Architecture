var pusher,channel;
function enablePusher(){
  Pusher.logToConsole = true;

  pusher = new Pusher('7ece5f520ad75845159d', {
    cluster: 'eu'
  });

  channel = pusher.subscribe('my-channel');
  receivedGeneralRequest()
  fetchingData()
  settledUpService()
  executingService()
  executedService()
  receivedAddingRequest()
  creatingService()
  updatingTDCreating()
  updatedTDCreating()
  settledPropCreating()
  writingFileCreating()
  receivedDeletingRequest()
  delitingService()
  receivedGetApiRequest()
  fetchingApi()
  fetchedApi()
  motorStarted()
  motorHalfRun()
  lcdConnected()
  lcdReceivedString()
  filterCheckingLatLon()
}

/********************
  MOTOR SERVICE SOCKET MESSAGE
********************/

async function motorStarted(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('motorStarted', function(data) {
      document.getElementById("textPusher").innerHTML = data.message
      $("#pusherBody").show();
  });
}
async function motorHalfRun(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('motorHalfRun', function(data) {
      document.getElementById("textPusher").innerHTML = data.message
      $("#pusherBody").show();
  });
}
/********************
  LCD SERVICE SOCKET MESSAGE
********************/
async function lcdConnected(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('lcdConnected', function(data) {
      document.getElementById("textPusher").innerHTML = data.message
      $("#pusherBody").show();
  });
}
async function lcdReceivedString(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('lcdReceivedString', function(data) {
      document.getElementById("textPusher").innerHTML = data.message
      $("#pusherBody").show();
  });
}


/********************
FILTER SERVICE SOCKET MESSAGE
********************/
async function filterCheckingLatLon(lat,lon){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('filterCheckingLatLon', function(data) {
    setTimeout(() => {
      document.getElementById("textPusher").innerHTML = data.message
      $("#pusherBody").show();
    },1000)

  });
}







async function receivedGetApiRequest(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('receivedGetApiRequest', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
  });
}
async function fetchingApi(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('fetchingApi', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
  });
}
async function fetchedApi(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('fetchedApi', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
    setTimeout(() => {
      console.log("IN PUSHER api");
      setBoolForDrawApi(true)
    },2000)
  });
}




async function receivedAddingRequest(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('receivedAddingRequest', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
  });

}
async function creatingService(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('creatingService', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
  });

}
async function updatingTDCreating(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('updatingTDCreating', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
  });

}
async function updatedTDCreating(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('updatedTDCreating', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
  });

}
async function settledPropCreating(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('settledPropCreating', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
  });

}
async function writingFileCreating(){
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  channel.bind('writingFileCreating', function(data) {
    document.getElementById("textPusherAdd").innerHTML = data.message
    $("#pusherBodyAdd").show();
    setTimeout(() => {
      console.log("IN PUSHER");
      setBoolForAdd(true)
    },2000)
  });

}


async function receivedDeletingRequest(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('receivedDeletingRequest', function(data) {
    document.getElementById("textPusher").innerHTML = data.message
    $("#pusherBody").show();
  });

}
async function delitingService(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('delitingService', function(data) {
    document.getElementById("textPusher").innerHTML = data.message
    $("#pusherBody").show();
    setTimeout(() => {
      console.log("IN PUSHER");
      setBoolForDelete(true)
    },2000)
  });

}







async function receivedGeneralRequest(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('receivedGeneralRequest', function(data) {
    document.getElementById("textPusher").innerHTML = data.message
    $("#pusherBody").show();
  });
}

async function fetchingData(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('fetchingData', function(data) {
    document.getElementById("textPusher").innerHTML = data.message
    $("#pusherBody").show();
  });
}
async function settledUpService(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('settledUpService', function(data) {
      document.getElementById("textPusher").innerHTML = data.message
      $("#pusherBody").show();
  });
}
async function executingService(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('executingService', function(data) {
      document.getElementById("textPusher").innerHTML = data.message
      $("#pusherBody").show();
  });
}
async function executedService(){
  $("#spinnerDiv").show();
  $("#spinner").show();
  channel.bind('executedService', function(data) {
      setTimeout(() => {
        $("#spinnerDiv").hide();
        $("#spinner").hide();
        document.getElementById("textPusher").innerHTML = data.message
        $("#pusherBody").show();
        console.log("IN PUSHER");
        setBoolForResult(true)
		  },2000)
  });
}
