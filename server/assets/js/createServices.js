var textJsonButton = {}
var textJsonDiv = {}
var apiServer = {}
var divShowed = {
  0: "actionsDiv",
  1: "createService",
}
var divThingShowed = {
  0: "propertiesBodyCreate",
  1: "createService"
}

var divEnd = {
  0: "propertiesBody",
  1: "actionsBody"
}
var serviceToSave = {}
var operandJson = {}
var objectJson = {}
var conditoinJson = {}
var indexDiv = 0,indexDivEnd = 0, indexCondition = 1;
var length,requestBool = false, requestBoolDelete = false, requestBoolAdd = false, requestBoolDrawApi = false;
function populatecreateThingStatusModal(){
  $('#turn').modal('show');
  $("#createModeDiv").hide();
  $("#previewServiceDiv").hide();
  $("#createService").hide();
  $("#turnBodyCreate").hide();
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  $.ajax({
    url: "/getApi",
    success: function(result){
      apiServer = result
      drawResultApi(result)
    }
  });
}
function populateseeAPIStatusModal(){
  console.log("IN API");
  document.getElementById("textPusher").innerHTML = ""
  $("#pusherBody").hide();
  $('#APIStatus').modal('show');
  $("#spinnerDiv").show();
  $("#spinner").show();
  $.ajax({
    url: "/getServices",
    success: function(result){
      console.log(result)
      console.log(Object.keys(result).length)
      length = Object.keys(result).length
      let index = 0
      let toAdd = "<div>"
      while(index < length){
        toAdd += '<div style="text-align: center; padding-left:25%; padding-right:25%;"><div class="form-check"><input id="checkboxService'+index+'" type="checkbox" style="margin-right:1px; position:absolute; left:0%;"><label for="checkboxService'+index+'" style="margin-right:2em;" id="labelService'+index+'">'+result[index]+'</label>'
        toAdd += '<button type="button"  class="btn btn-primary btn-sm" id="executeService'+index+'" onclick="executeService(this.id)" style="position:absolute; right:0%;">Execute </button></div></div>'
        index++;
      }
      toAdd+="</div>"
      console.log(toAdd)
      document.getElementById("turnBody").innerHTML = toAdd
      $("#turnBody").show()
      $("#spinnerDiv").hide()
      $("#spinner").hide()
    }
  });
}

function createDropDown(){
  $("#turnBodyCreate").hide()
  $("#createHeader").hide()
  $("#createAction").show()
  $("#nextButton").hide()
  $("#previewService").show()
  $("#exposeService").show()
  $("#createModeDiv").hide();
  $("#previewServiceDiv").hide();
  $("#createService").hide();
  $("#turnBodyCreate").hide();
  $("#spinnerDivCreate").show();
  $("#spinnerCreate").show();
  document.getElementById("actionListThen").innerHTML = ""
  document.getElementById("actionListElse").innerHTML = ""
  document.getElementById("paramListThen").innerHTML = ""
  document.getElementById("paramListElse").innerHTML = ""
  requestBoolDrawApi = true
  console.log(apiServer);
  drawDropDownApi(apiServer)
  // $.ajax({
  //   url: "/getApi",
  //   success: function(result){
  //   }
  // });
}
function changePropTag(id,index){
  var type = document.getElementById(id).value
  let text = id.replace("Button","")
  text = text.replace("API","API ")
  text = text.substring(0, text.length - 1);
  document.getElementById("propTag"+index).innerHTML = text
  switch (type) {
    case "Number":
    var compText = "<button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='minus"+index+"'>minus</button><button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='higher"+index+"'>higher</button><button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='minus equals"+index+"'>minus equals</button><button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='higher equals"+index+"'>higher equals</button><button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='equal"+index+"'>equal</button><button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='different"+index+"'>different</button>"
    document.getElementById("compareList"+index).innerHTML = compText
    break;
    case "String":
    var compText = "<button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='equal"+index+"'>equal</button><button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='different"+index+"'>different</button>"
    document.getElementById("compareList"+index).innerHTML = compText
    break;
    case "object":
    var compText = "<button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='nothing"+index+"'>nothing</button>"
    document.getElementById("compareList"+index).innerHTML = compText
    break;
    case "Boolean":
    var compText = "<button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='equal"+index+"'>equal</button><button class='dropdown-item' type='button' onclick='changeCompareTag(this.id,"+index+")' id='different"+index+"'>different</button>"
    document.getElementById("compareList"+index).innerHTML = compText
    break;
    default:

  }
}

function changeValueUserTag(id,index){
  let text = document.getElementById(id).value
  document.getElementById("valueTag"+index).innerHTML = text
}

function changeValueTag(id,index){
  let text = id.replace("Button","")
  text = text.replace("API","API ")
  text = text.substring(0, text.length - 1);
  document.getElementById("valueTag"+index).innerHTML = text
}

function changeActionTagElse(id){
  let text = id.replace("ButtonElse","")
  text = text.replace("API","API ")
  let value = document.getElementById(id).value.split(":")

  switch (value[1]) {
    case "Number":
    var paramText = "<div class='form-row'><div class='col'><input type='number' class='form-control' placeholder='"+value[0]+"' id='paramElse'></div></div>";
    paramText += document.getElementById("propList1").innerHTML
    while(paramText.includes('changePropTag(this.id,1)')){
      paramText = paramText.replace("changePropTag(this.id,1)","document.getElementById('paramTagElse').innerHTML = this.innerHTML")
    }
    document.getElementById("paramListElse").innerHTML = paramText
    $("#obectInputElse").hide()
    document.getElementById('paramElse').addEventListener('input', (event) => {

      let text = document.getElementById("paramElse").value
      document.getElementById("paramTagElse").innerHTML = text

    });
    break;
    case "String":
    var paramText = "<div class='form-row'><div class='col'><input type='text' class='form-control' placeholder='"+value[0]+"' id='paramElse'></div></div>"
    paramText += document.getElementById("propList1").innerHTML
    while(paramText.includes('changePropTag(this.id,1)')){
      paramText = paramText.replace("changePropTag(this.id,1)","document.getElementById('paramTagElse').innerHTML = this.innerHTML")
    }
    document.getElementById("paramListElse").innerHTML = paramText
    $("#obectInputElse").hide()
    document.getElementById('paramElse').addEventListener('input', (event) => {

      let text = document.getElementById("paramElse").value
      document.getElementById("paramTagElse").innerHTML = text

    });
    break;
    case "object":
    var paramText = "<div class='form-row'><div class='col'><input type='text' class='form-control' placeholder='"+value[0]+"' id='paramElse'></div></div>"
    document.getElementById("paramListElse").innerHTML = paramText
    $("#obectInputElse").show()
    document.getElementById('paramElse').addEventListener('input', (event) => {

      let text = document.getElementById("paramElse").value
      document.getElementById("paramTagElse").innerHTML = text

    });
    break;
    default:

  }

  document.getElementById("actionTagElse").innerHTML = text
}
function changeActionTagThen(id){
  let text = id.replace("ButtonThen","")
  text = text.replace("API","API ")
  let value = document.getElementById(id).value.split(":")

  switch (value[1]) {
    case "Number":
    var paramText = "<div class='form-row'><div class='col'><input type='number' class='form-control' placeholder='"+value[0]+"' id='paramThen'></div></div>"
    paramText += document.getElementById("propList1").innerHTML
    while(paramText.includes('changePropTag(this.id,1)')){
      paramText = paramText.replace("changePropTag(this.id,1)","document.getElementById('paramTagThen').innerHTML = this.innerHTML")
    }
    document.getElementById("paramListThen").innerHTML = paramText
    $("#obectInputThen").hide()

    document.getElementById('paramThen').addEventListener('input', (event) => {

      let text = document.getElementById("paramThen").value
      document.getElementById("paramTagThen").innerHTML = text

    });
    break;
    case "String":
    var paramText = "<div class='form-row'><div class='col'><input type='text' class='form-control' placeholder='"+value[0]+"' id='paramThen'></div></div>"
    paramText += document.getElementById("propList1").innerHTML
    while(paramText.includes('changePropTag(this.id,1)')){
      paramText = paramText.replace("changePropTag(this.id,1)","document.getElementById('paramTagThen').innerHTML = this.innerHTML")
    }
    document.getElementById("paramListThen").innerHTML = paramText
    $("#obectInputThen").hide()

    document.getElementById('paramThen').addEventListener('input', (event) => {

      let text = document.getElementById("paramThen").value
      document.getElementById("paramTagThen").innerHTML = text

    });
    break;
    case "object":
    var paramText = "<div class='form-row'><div class='col'><input type='text' class='form-control' placeholder='"+value[0]+"' id='paramThen'></div></div>"
    document.getElementById("paramListThen").innerHTML = paramText
    $("#obectInputThen").show()

    document.getElementById('paramThen').addEventListener('input', (event) => {

      let text = document.getElementById("paramThen").value
      document.getElementById("paramTagThen").innerHTML = text

    });
    break;
    default:
  }

  document.getElementById("actionTagThen").innerHTML = text
}

function changeCompareTag(id,index){
  let text = id.substring(0, id.length - 1);

  document.getElementById("compareTag"+index).innerHTML = text
}

function changeLogicTag(id,type){
  let text = id.replace(type,"")
  document.getElementById("logicTag"+type).innerHTML = text
}


function nextDiv(){
  if(indexDiv < 1){
    $("#"+divShowed[indexDiv]).hide()
    $("#"+divThingShowed[indexDiv]).hide()
    indexDiv++;
    console.log(indexDiv)
    if(indexDiv == 1) createDropDown()
    else $("#turnBodyCreate").show()
    $("#"+divShowed[indexDiv]).show()
    $("#"+divThingShowed[indexDiv]).show()
    // $("#createService").hide();
  }
}
function prevDiv(){
  if(indexDiv > 0){
    $("#nextButton").show()
    $("#exposeService").hide()
    $("#previewService").hide()
    $("#previewServiceDiv").hide()
    $("#thenElseDiv").hide();

    $("#addCondition").hide();
    $("#serviceNameDiv").hide();

    $("#turnBodyCreate").show()
    $("#createHeader").show()
    $("#createAction").hide()
    $("#"+divShowed[indexDiv]).hide()
    $("#"+divThingShowed[indexDiv]).hide()
    indexDiv--;
    $("#"+divShowed[indexDiv]).show()
    $("#"+divThingShowed[indexDiv]).show()
  }
}

function nextDivEnd(){
  if(indexDivEnd < 1){
    $("#"+divEnd[indexDivEnd]).hide()
    indexDivEnd++;
    $("#"+divEnd[indexDivEnd]).show()
  }
}
function prevDivEnd(){
  if(indexDivEnd > 0){
    $("#"+divEnd[indexDivEnd]).hide()
    indexDivEnd--;
    $("#"+divEnd[indexDivEnd]).show()
  }
}



function exposeService(){
  //here save action
  let ind = Object.keys(serviceToSave).length
  let index = 1
  let ifString = "if("
  while(index < 6){
    let firstOP = document.getElementById("propTag"+index).innerHTML
    let compareHTML = document.getElementById("compareTag"+index).innerHTML
    let secondOP = document.getElementById("valueTag"+index).innerHTML
    let logicOP = "",logicVal =""
    if(index < 5) logicOP = document.getElementById("logicTag"+index).innerHTML
    if(firstOP != "Properties" && compareHTML != "Compare" && secondOP != "Value" && (logicOP != "Logic operator" || logicOP != "")){
      operandJson[index] = {}
      let typeID = firstOP.replace(" ","")+"Button1"
      let firstOPType = document.getElementById(typeID).value
      let compare = getCompareString(compareHTML)
      if(compare == "") {
        alert(index+" Compare operand not set. Action not Added")
        return
      }

      switch (firstOPType) {
        case "Number":
        if( !(!isNaN(secondOP) && !isNaN(parseFloat(secondOP))) ) {
          try{
            let typeIDSecond = secondOP.replace(" ","")+"Button1"
            let secondOPType = document.getElementById(typeIDSecond).value
            if(secondOPType == "Number"){
              ifString += firstOP + " " + compare + " " + secondOP + " "
              if(logicOP != "Logic operator" && logicOP != ""){
                logicVal = document.getElementById(logicOP+index).value
                ifString += logicVal + " "
              }

              // operandJson[index][0] = document.getElementById("startBrackets"+index).innerHTML //start brackets

              operandJson[index][0] = firstOP.replace(" ","") //first operand
              operandJson[index][1] = compare.replace(" ","") //compare operand
              if(secondOP.includes("API")) operandJson[index][2] = secondOP.replace(" ","") //second operand
              else operandJson[index][2] = secondOP //second operand
              // if(index<5) operandJson[index][4] = document.getElementById("middleBrackets"+index).innerHTML //middle operand

              operandJson[index][3] = logicVal //logic operand
              // operandJson[index][6] = document.getElementById("endBrackets"+index).innerHTML //end operand
              //alert(ifString)
            }
            else {
              alert("Second operand is not a Number! Action not added")
              return
            }
          }
          catch(e){
            alert("Second operand is not a Number! Action not added")
            return
          }
        }
        else {
          ifString += firstOP + " " + compare + " " + secondOP + " "
          if(logicOP != "Logic operator" && logicOP != ""){
            logicVal = document.getElementById(logicOP+index).value
            ifString += logicVal + " "
          }

          // operandJson[index][0] = document.getElementById("startBrackets"+index).innerHTML //start brackets

          operandJson[index][0] = firstOP.replace(" ","") //first operand
          operandJson[index][1] = compare.replace(" ","") //compare operand
          if(secondOP.includes("API")) operandJson[index][2] = secondOP.replace(" ","") //second operand
          else operandJson[index][2] = secondOP //second operand
          // if(index<5) operandJson[index][4] = document.getElementById("middleBrackets"+index).innerHTML //middle operand

          operandJson[index][3] = logicVal //logic operand
          // operandJson[index][6] = document.getElementById("endBrackets"+index).innerHTML //end operand
        }
        break;
        case "String":
        ifString += firstOP + " " + compare + " " + secondOP + " "
        if(logicOP != "Logic operator" && logicOP != ""){
          logicVal = document.getElementById(logicOP+index).value
          ifString += logicVal + " "
        }

        // operandJson[index][0] = document.getElementById("startBrackets"+index).innerHTML //start brackets

        operandJson[index][0] = firstOP.replace(" ","") //first operand
        operandJson[index][1] = compare.replace(" ","") //compare operand
        if(secondOP.includes("API")) operandJson[index][2] = secondOP.replace(" ","") //second operand
        else operandJson[index][2] = secondOP //second operand
        // if(index<5) operandJson[index][4] = document.getElementById("middleBrackets"+index).innerHTML //middle operand

        operandJson[index][3] = logicVal //logic operand
        // operandJson[index][6] = document.getElementById("endBrackets"+index).innerHTML //end operand
        break;
        case "Boolean":
        ifString += firstOP + " " + compare + " " + secondOP + " "
        if(logicOP != "Logic operator" && logicOP != ""){
          logicVal = document.getElementById(logicOP+index).value
          ifString += logicVal + " "
        }

        // operandJson[index][0] = document.getElementById("startBrackets"+index).innerHTML //start brackets

        operandJson[index][0] = firstOP.replace(" ","") //first operand
        operandJson[index][1] = compare.replace(" ","") //compare operand
        if(secondOP.includes("API")) operandJson[index][2] = secondOP.replace(" ","") //second operand
        else operandJson[index][2] = secondOP //second operand
        // if(index<5) operandJson[index][4] = document.getElementById("middleBrackets"+index).innerHTML //middle operand

        operandJson[index][3] = logicVal //logic operand
        // operandJson[index][6] = document.getElementById("endBrackets"+index).innerHTML //end operand
        break;
        case "object":
        try{
          JSON.parse(secondOP)
        }
        catch(e){
          try{
            let typeIDSecond = secondOP.replace(" ","")+"Button1"
            let secondOPType = document.getElementById(typeIDSecond).value
            if(secondOPType == "object"){
              ifString += firstOP + " " + compare + " " + secondOP + " "
              if(logicOP != "Logic operator" && logicOP != ""){
                logicVal = document.getElementById(logicOP+index).value
                ifString += logicVal + " "
              }
              // operandJson[index][0] = document.getElementById("startBrackets"+index).innerHTML //start brackets

              operandJson[index][0] = firstOP.replace(" ","") //first operand
              operandJson[index][1] = compare.replace(" ","") //compare operand
              if(secondOP.includes("API")) operandJson[index][2] = secondOP.replace(" ","") //second operand
              else operandJson[index][2] = secondOP //second operand
              // if(index<5) operandJson[index][4] = document.getElementById("middleBrackets"+index).innerHTML //middle brackets

              operandJson[index][3] = logicVal //logic operand
              // operandJson[index][6] = document.getElementById("endBrackets"+index).innerHTML //end operand

            }
            else {
              alert("Second operand is not an Object! Action not added")
              return
            }
          }
          catch(e){
            alert("Second operand is not an Object! Action not added")
            return
          }
        }
        break;
        default:

      }
    }
    index++
  }
  ifString +=")"
  let check = 1,actionThen,paramThen,paramObjectThen,haveObj,actionElse,paramElse,paramObjectElse,haveObjElse,serviceName
  try{
    serviceName = document.getElementById("serviceName").value

    actionThen = document.getElementById("actionTagThen").innerHTML
    paramThen = document.getElementById("paramTagThen").innerHTML
    paramObjectThen = document.getElementById("objectInputTagThen").innerHTML
    haveObj = document.getElementById(actionThen+"ButtonThen").value.split(":")
    haveObj = haveObj[1]

    try{
      actionElse = document.getElementById("actionTagElse").innerHTML
      paramElse = document.getElementById("paramTagElse").innerHTML
      paramObjectElse = document.getElementById("objectInputTagElse").innerHTML
      haveObjElse = document.getElementById(actionElse+"ButtonElse").value.split(":")
      haveObjElse = haveObjElse[1]
    }
    catch(e){
      console.log("else not required and not inserted")
    }
    check = 1
    if(serviceName == ""){
      check = 0;
      alert("No service name inserted")
    }
  }
  catch(e){
    check = 0
    alert("Some problem in then "+e)
  }
  if(Object.keys(operandJson).length == 0){
    alert("No properties inserted in if condition!")
    return;
  }
  if(check){
    let string = ""
    for(var x in operandJson){
      eval(operandJson[x][0] + " = 'stringProva'")
      if( !(!isNaN(operandJson[x][0]) && !isNaN(parseFloat(operandJson[x][0]))) ) eval(operandJson[x][0] + " = 'stringProva'")
      for(var y in operandJson[x]){
        string+=" " + operandJson[x][y]
      }
    }
    try{
      var conditionTrue = strEval(string);

      if(conditionTrue){
        console.log("Condizione RIUSCITO");
      }
      else{
        console.log("Condizione MA ELSE");
      }
      serviceToSave = {}
      serviceToSave["string"] = string
      serviceToSave["name"] = serviceName.replace(/ /g,"");
      console.log(serviceToSave["name"])
      serviceToSave["condition"] = operandJson
      serviceToSave["then"] = {}
      serviceToSave["then"]["action"] = actionThen
      serviceToSave["then"]["param"] = paramThen
      if(haveObj == "object") serviceToSave["then"]["object"] = paramObjectThen.replace(" ","")


      serviceToSave["else"] = {}
      serviceToSave["else"]["action"] = actionElse
      serviceToSave["else"]["param"] = paramElse
      if(haveObjElse == "object") serviceToSave["else"]["object"] = paramObjectElse.replace(" ","")
      sendService()
      console.log(serviceToSave);
    }
    catch(e){
      alert(e)
    }
    console.log(string)
  }
}

function getCompareString(compareHTML){
  let comp = ""
  switch (compareHTML) {
    case "minus":
    comp = "<"
    break;
    case "higher":
    comp = ">"
    break;
    case "minus equals":
    comp = "<="
    break;
    case "higher equals":
    comp = ">="
    break;
    case "equal":
    comp = "=="
    break;
    case "different":
    comp = "!="
    break;
    case "nothing":
    comp = "!="
    break;
    default:

  }
  return comp
}

function changeObjectInputTagThen(id){
  let text = id.replace("Button","")
  text = text.replace("API","API ")
  document.getElementById("objectInputTagThen").innerHTML = text
}

function changeObjectInputTagElse(id){
  let text = id.replace("Button","")
  text = text.replace("API","API ")
  document.getElementById("objectInputTagElse").innerHTML = text
}


function fitBrackets(input){
  var regex = /[^(]/gi
    input.innerHTML = input.innerHTML.replace(regex,"")
  }
  function fitBracketsMiddle(input){
    var regex = /[^()]/gi
    input.innerHTML = input.innerHTML.replace(regex,"")
  }
  function fitBracketsEnd(input){
    var regex = /[^)]/gi
    input.innerHTML = input.innerHTML.replace(regex,"")
  }
  function strEval(fn) {
    return new Function('return ' + fn)();
  }

  function sendService(){
    $("#spinnerDivCreate").show();
    $("#spinnerCreate").show();
    $("#createModeDiv").hide();
    $("#showPreviewDiv").hide();
    $("#createService").hide();
    $.ajax({
      url: "/addService",
      method: "POST",
      data: JSON.stringify(serviceToSave),
      dataType:"json",
      contentType: "application/json",
      success: function (data) {
        printAdd(data)
        serviceToSave = {}
      },
      error: function (error) {
        alert(error)
        serviceToSave = {};
      }
    })
  }

  function download(filename, text) {
    var element = document.createElement('a');
    element.innerHTML = filename
    element.setAttribute('id', 'download');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(text)));
    element.setAttribute('download', filename);

    $('#bodyToAppend').append(element)
    $("#download").click(function () {
      $('#responseModal').modal('hide');
      $('#download').remove()

    })
    $('#responseModal').modal('show')
    $('#primary').text("Download")
    $('#secondary').text("Cancel")
    //$('#primary').click(function() {
    element.click()
    $('#responseModal').modal('hide')
    $('#download').remove()
    //})
    $('#secondary').click(function() {
      $('#responseModal').modal('hide')
      $('#download').remove()
    })
    $('#text').text("Success! Received response: ")

  }

  function executeService(service){
    $("#spinnerDiv").show();
    $("#spinner").show();
    $("#turnBody").hide();
    console.log(service)
    let index = service.slice(-1);
    let serviceName = document.getElementById("labelService"+index).innerHTML.replace(".js","")
    console.log(index)
    console.log(serviceName)
    $.ajax({
      url: "/executeService?serviceName="+serviceName,
      method: "GET",
      success: function (data) {
        printResult(data,serviceName)
        serviceToSave = {}

      },
      error: function () {
        $("#spinnerDiv").hide();
        $("#spinner").hide();
        alert('Error');
        serviceToSave = {}
      }
    })
  }

  function trashService(){
    $("#turnBody").hide();
    $("#spinnerDiv").show();
    $("#spinner").show();
    let index = 0;
    let serviceToDelete = ""
    while(index < length){
      let checkBox = document.getElementById("checkboxService"+index).checked
      let serviceName = document.getElementById("labelService"+index).innerHTML.replace(".js","")
      if(checkBox) serviceToDelete +=  serviceName + ","
      index++
    }
    if(serviceToDelete != ""){
      serviceToDelete = serviceToDelete.substring(0,serviceToDelete.length - 1)
      $.ajax({
        url: "/deleteService?serviceName="+serviceToDelete,
        method: "DELETE",
        success: function (data) {
          printDelete(data)
        },
        error: function () {
          $("#spinnerDiv").hide();
          $("#spinner").hide();
          alert('Error');
        }
      })
    }
    else{
      alert("No service selected.")
      $('#APIStatus').modal('hide');
      populateseeAPIStatusModal()
    }
    console.log(serviceToDelete)

  }

  function setBoolForResult(boolean){
    requestBool = boolean
  }

  function setBoolForDelete(boolean){
    requestBoolDelete = boolean
  }

  function setBoolForAdd(boolean){
    requestBoolAdd = boolean
  }
  function setBoolForDrawApi(boolean){
    requestBoolDrawApi = boolean
  }

  function printResult(data,serviceName) {
    if (requestBool) {
      requestBool = false
      $("#spinnerDiv").hide();
      $("#spinner").hide();
      document.getElementById("textPusher").innerHTML = ""
      $("#pusherBody").hide();
      $("#turnBody").show();
      console.log(data)
      if(typeof data == 'object'){
        console.log(serviceName+"Result.json")
        download(serviceName+"Result.json",data);
      }
      else window.alert("Success! Received response: " + data)
    } else {
      setTimeout(() => {
        printResult(data,serviceName)
      },2000)
    }
  }

  function printDelete(data){
    if (requestBoolDelete) {
      requestBoolDelete = false
      $('#APIStatus').modal('hide');
      populateseeAPIStatusModal()
      console.log(data)
      window.alert("Received response: " + data)

    } else {
      setTimeout(() => {
        printDelete(data)
      },2000)
    }
  }

  function printAdd(data){
    if (requestBoolAdd) {
      requestBoolAdd = false
      $("#spinnerDivCreate").hide();
      $("#spinnerCreate").hide();
      $("#createService").show();
      $("#createModeDiv").show();
      $("#thenElseDiv").show();

      document.getElementById("textPusherAdd").innerHTML = ""
      window.alert("Success! Received response: " + data["res"])

    } else {
      setTimeout(() => {
        printAdd(data)
      },2000)
    }
  }

  function drawResultApi(result){
    if (requestBoolDrawApi) {
      requestBoolDrawApi = false
      $("#spinnerDivCreate").hide();
      $("#spinnerCreate").hide();
      $("#turnBodyCreate").show();
      document.getElementById("textPusherAdd").innerHTML = ""

      document.getElementById("propertiesBodyCreate").innerHTML = "<h4>Properties</h4><br>"

      var buttonText = "<p>"
      for(var api in result["endpoint"]){
        if(result["endpoint"][api][2] != "international_space_station" && result["endpoint"][api][2] != "asteroid"){

          textJsonButton[result["endpoint"][api][2]] = "<p>"+result["endpoint"][api][2] + ":<br>"
          textJsonDiv[result["endpoint"][api][2]] = ""
        }
      }
      for(var api in result["endpoint"]){
        if(result["endpoint"][api][2] != "international_space_station" && result["endpoint"][api][2] != "asteroid"){
          toAdd = ""
          textJsonButton[result["endpoint"][api][2]] += '<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse'+api+'" aria-expanded="false" aria-controls="collapse'+api+'Example">'+api+'</button>'
          textJsonDiv[result["endpoint"][api][2]] += '<div class="collapse" id="collapse'+api+'"><div class="card card-body" id="'+api+'Properties"><div>'

          for(var prop in result["client"]["properties"][result["endpoint"][api][2]] ){
            let properties = result["client"]["properties"][result["endpoint"][api][2]][prop]["name"]
            toAdd +='<div class="row"><div class="form-check form-check-inline"><input id="'+api+properties+'Check" type="checkbox"><label for="'+api+properties+'Check">'+properties+'</label></div></div>'
          }
          toAdd+='</div></div></div>'
          textJsonDiv[result["endpoint"][api][2]] +=  toAdd
        }
      }
      for(var type in textJsonButton){
        document.getElementById("propertiesBodyCreate").innerHTML += textJsonButton[type] + "</p>" + textJsonDiv[type]
      }
      document.getElementById("utilsDiv").innerHTML = "<h4>Utils</h4><br>"
      let toAddUtils = ""
      for(var act in result["client"]["actions"] ){
        let action = result["client"]["actions"][act]["name"]
        toAddUtils+='<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+action+'Check" value=""><label class="form-check-label" for="'+action+'Check">'+action+'</label></div>'
      }
      document.getElementById("utilsDiv").innerHTML += toAddUtils

      let toAddButton = "", toAddDiv = ""
      toAdd = ""
      document.getElementById("webThingDiv").innerHTML = "<h4>Web Thing</h4><br>"
      for(var thing in result["client"]["webThing"] ){
        toAddButton += '<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse'+thing+'" aria-expanded="false" aria-controls="collapse'+thing+'Example">'+thing+'</button>'
        toAddDiv += '<div class="collapse" id="collapse'+thing+'"><div class="card card-body" id="'+thing+'Properties"><div><h6>Properties:</h6>'
        for(var prop in result["client"]["webThing"][thing]["properties"]){
          let properties = result["client"]["webThing"][thing]["properties"][prop]["name"]
          toAddDiv +='<div class="row" style="margin-left:3em;"><div class="form-check form-check-inline"><input id="'+thing+properties+'Check" type="checkbox"><label for="'+thing+properties+'Check">'+properties+'</label></div></div>'
        }
        toAddDiv += '<h6>Actions:</h6>'
        for(var act in result["client"]["webThing"][thing]["action"]){
          let action = result["client"]["webThing"][thing]["action"][prop]["name"]
          toAddDiv +='<div class="row" style="margin-left:3em;"><div class="form-check form-check-inline"><input id="'+thing+action+'Check" type="checkbox"><label for="'+thing+action+'Check">'+action+'</label></div></div>'
        }
        toAddDiv += '</div></div></div>'
        document.getElementById("webThingDiv").innerHTML += toAddButton + toAddDiv
        toAddButton = ""
        toAddDiv = ""
      }
    }
    else{
      setTimeout(() => {
        drawResultApi(result)
      },2000)
    }
  }

  function drawDropDownApi(result){
    if (requestBoolDrawApi) {
      console.log("ENTRATO");
      requestBoolDrawApi = false
      document.getElementById("textPusherAdd").innerHTML = ""
      $("#createModeDiv").show();
      $("#createService").show();
      $("#thenElseDiv").show();

      $("#createAction").show();
      $("#addCondition").show();
      $("#serviceNameDiv").show();

      $("#turnBodyCreate").hide();
      $("#spinnerDivCreate").hide();
      $("#spinnerCreate").hide();
      let toAddDrop = "",toAddDropValue ="",index = 1,toAddObject = "",toAddObjectElse = ""
      while(index <= 5){
        toAddDrop = ""
        toAddDropValue = ""
        toAddObject = ""
        toAddObjectElse = ""
        document.getElementById("propList"+index).innerHTML = ""
        document.getElementById("compareList"+index).innerHTML = ""
        for(var api in result["endpoint"]){
          if(result["endpoint"][api][2] != "international_space_station" && result["endpoint"][api][2] != "asteroid"){
            for(var prop in result["client"]["properties"][result["endpoint"][api][2]] ){

              let properties = result["client"]["properties"][result["endpoint"][api][2]][prop]["name"]
              let type = result["client"]["properties"][result["endpoint"][api][2]][prop]["type"]
              let checkBox = document.getElementById(api+properties+"Check")
              if(checkBox.checked){
                if(type != "object"){
                  toAddDrop+="<button class='dropdown-item' type='button' onclick='changePropTag(this.id,"+index+")' value='"+type+"' id='"+api+properties+"Button"+index+"'>"+api+properties+'</button>'
                  toAddDropValue+="<button class='dropdown-item' type='button' onclick='changeValueTag(this.id,"+index+")' value='"+type+"' id='"+api+properties+"Button"+index+"'>"+api+properties+'</button>'
                }
                else{
                  toAddObject += "<button class='dropdown-item' type='button' onclick='changeObjectInputTagThen(this.id)' value='"+type+"' id='"+api+properties+"Button'>"+api+properties+'</button>'
                  toAddObjectElse += "<button class='dropdown-item' type='button' onclick='changeObjectInputTagElse(this.id)' value='"+type+"' id='"+api+properties+"Button'>"+api+properties+'</button>'
                }
              }
            }
          }
        }
        //toAddDropValue+= "<div class='form-row'><div class='col'><input type='text' class='form-control' placeholder='Value' id='userValue"+index+"' ></div></div>"

        document.getElementById("propList"+index).innerHTML = toAddDrop
        document.getElementById("valueList"+index).innerHTML = toAddDropValue
        document.getElementById("objectInputListThen").innerHTML = toAddObject
        document.getElementById("objectInputListElse").innerHTML = toAddObjectElse
        toAddDrop = ""
        toAddDropValue = ""
        toAddObject = ""
        toAddObjectElse = ""
        toAdd = ""
        for(var thing in result["client"]["webThing"] ){
          for(var prop in result["client"]["webThing"][thing]["properties"]){
            let properties = result["client"]["webThing"][thing]["properties"][prop]["name"]
            let type = result["client"]["webThing"][thing]["properties"][prop]["type"]
            let checkBox = document.getElementById(thing+properties+"Check")
            if(checkBox.checked){
              if(type != "object"){
                toAddDrop+="<button class='dropdown-item' type='button' onclick='changePropTag(this.id,"+index+")' value='"+type+"' id='"+thing+properties+"Button"+index+"'>"+thing+properties+'</button>'
                toAddDropValue+="<button class='dropdown-item' type='button' onclick='changeValueTag(this.id,"+index+")' value='"+type+"' id='"+thing+properties+"Button"+index+"'>"+thing+properties+'</button>'
              }
              else{
                toAddObject += "<button class='dropdown-item' type='button' onclick='changeObjectInputTagThen(this.id)' value='"+type+"' id='"+thing+properties+"Button'>"+thing+properties+'</button>'
                toAddObjectElse += "<button class='dropdown-item' type='button' onclick='changeObjectInputTagElse(this.id)' value='"+type+"' id='"+thing+properties+"Button'>"+thing+properties+'</button>'
              }
            }

          }
          document.getElementById("propList"+index).innerHTML += toAddDrop
          document.getElementById("objectInputListThen").innerHTML += toAddObject
          document.getElementById("objectInputListElse").innerHTML += toAddObjectElse
          // document.getElementById("valueList"+index).innerHTML += toAddDropValue


          // for(var act in result["client"]["webThing"][thing]["action"]){
          //   let action = result["client"]["webThing"][thing]["action"][prop]["name"]
          //   toAddDiv +='<div class="row" style="margin-left:3em;"><div class="form-check form-check-inline"><input id="'+thing+action+'Check" type="checkbox"><label for="'+thing+action+'Check">'+action+'</label></div></div>'
          // }
          toAddDrop = ""
          // toAddDropValue = ""
          toAddObject = ""
          toAddObjectElse = ""
        }
        toAddDropValue+= "<div class='form-row'><div class='col'><input type='text' class='form-control' placeholder='Value' id='userValue"+index+"' ></div></div>"
        document.getElementById("valueList"+index).innerHTML += toAddDropValue
        document.getElementById('userValue'+index).addEventListener('input', (event) => {
          let id = event.srcElement.id
          changeValueUserTag(id,id.substring(id.length - 1, id.length))
        });
        index++;
      }
      var toAddDropThen = "",toAddDropElse = ""
      for(var act in result["client"]["actions"] ){
        let action = result["client"]["actions"][act]["name"]
        let type = result["client"]["actions"][act]["param"]["name"]+":"+result["client"]["actions"][act]["param"]["type"]
        let checkBox = document.getElementById(action+"Check")
        if(checkBox.checked){
          toAddDropThen+="<button class='dropdown-item' type='button' onclick='changeActionTagThen(this.id)' value='"+type+"' id='"+action+"ButtonThen'>"+action+'</button>'
          toAddDropElse+="<button class='dropdown-item' type='button' onclick='changeActionTagElse(this.id)' value='"+type+"' id='"+action+"ButtonElse'>"+action+'</button>'
        }
      }
      for(var thing in result["client"]["webThing"] ){
        for(var act in result["client"]["webThing"][thing]["action"]){
          console.log(result["client"]["webThing"][thing]["action"][act]["param"]);
          let action = result["client"]["webThing"][thing]["action"][act]["name"]
          let type = result["client"]["webThing"][thing]["action"][act]["param"]["name"]+":"+result["client"]["webThing"][thing]["action"][act]["param"]["type"]

          let checkBox = document.getElementById(thing+action+"Check")
          if(checkBox.checked){
            toAddDropThen+="<button class='dropdown-item' type='button' onclick='changeActionTagThen(this.id)' value='"+type+"' id='"+action+"ButtonThen'>"+action+'</button>'
            toAddDropElse+="<button class='dropdown-item' type='button' onclick='changeActionTagElse(this.id)' value='"+type+"' id='"+action+"ButtonElse'>"+action+'</button>'
          }
        }
      }
      document.getElementById("actionListThen").innerHTML = toAddDropThen
      document.getElementById("actionListElse").innerHTML = toAddDropElse

    } else {
      setTimeout(() => {
        drawDropDownApi(result)
      },2000)
    }
  }


function changeConditionWithIndex(index){
  let ind = 1;
  while(ind < 6){
    $("#condition"+ind).hide();
    ind++;
  }
  $("#condition"+index).show();
}

function previewCondition(){
  if($('#createModeDiv').css('display') == 'none'){
    $("#createModeDiv").show();
    $("#previewServiceDiv").hide();
    document.getElementById("previewService").innerHTML = "Preview service"
  }
  else{
    let index = 1
    let ifString = "<span style='color:c678dd;'>if</span>("
    while(index < 6){
      let firstOP = document.getElementById("propTag"+index).innerHTML
      let compareHTML = document.getElementById("compareTag"+index).innerHTML
      let secondOP = document.getElementById("valueTag"+index).innerHTML
      let logicOP = "",logicVal =""
      if(index < 5) logicOP = document.getElementById("logicTag"+index).innerHTML
      if(firstOP != "Properties" && compareHTML != "Compare" && secondOP != "Value" && (logicOP != "Logic operator" || logicOP != "")){
        operandJson[index] = {}
        let typeID = firstOP.replace(" ","")+"Button1"
        let firstOPType = document.getElementById(typeID).value
        let compare = getCompareString(compareHTML)
        ifString += firstOP + " <span style='color:#56b6c2;'>" + compare + "</span> " + secondOP + " "
        if(logicOP != "Logic operator" && logicOP != ""){
          logicVal = document.getElementById(logicOP+index).value
          ifString += "<span style='color:#56b6c2;'>" + logicVal + "</span> "
        }
      }
      index++
    }
    ifString += "){\n"
    let check = 1,actionThen = "",paramThen = "",paramObjectThen = ",",haveObj,actionElse = "",paramElse = "",paramObjectElse = ",",haveObjElse,serviceName
    try{

      actionThen = document.getElementById("actionTagThen").innerHTML
      paramThen = document.getElementById("paramTagThen").innerHTML
      console.log("OBJ THEN");
      console.log(document.getElementById("objectInputTagThen").innerHTML);
      paramObjectThen += document.getElementById("objectInputTagThen").innerHTML
      haveObj = document.getElementById(actionThen+"ButtonThen").value.split(":")
      haveObj = haveObj[1]

      try{
        actionElse = document.getElementById("actionTagElse").innerHTML
        paramElse = document.getElementById("paramTagElse").innerHTML
        paramObjectElse += document.getElementById("objectInputTagElse").innerHTML
        console.log("OBJ ELSE");
        console.log(document.getElementById("objectInputTagElse").innerHTML );

        haveObjElse = document.getElementById(actionElse+"ButtonElse").value.split(":")
        haveObjElse = haveObjElse[1]
      }
      catch(e){
        console.log("else not required and not inserted")
      }
      check = 1
    }
    catch(e){
      check = 0
      alert("Some problem in then "+e)
    }
    if(paramObjectThen == ",Object Input") paramObjectThen = ""
    if(paramObjectElse == ",Object Input") paramObjectElse = ""
    if(paramThen == "Parameters") paramThen = ""
    if(paramElse == "Parameters") paramElse = ""
    ifString += "\t<span style='color:#61afef;'>" + actionThen + "</span>("+paramThen+paramObjectThen+");\n}"
    ifString += "\nelse{\n\t<span style='color:#61afef;'>" + actionElse + "</span>("+paramElse+paramObjectElse+");\n}"
    document.getElementById("previewServiceDiv").innerHTML = "<pre>" + ifString + "</pre>"
    console.log(document.getElementById("previewServiceDiv").innerHTML);
    $("#createModeDiv").hide();
    $("#previewServiceDiv").show();
    document.getElementById("previewService").innerHTML = "Back to creation service"

  }
}

function resetProp(index){
  document.getElementById("propTag"+index).innerHTML = "Properties"
  document.getElementById("compareTag"+index).innerHTML = "Compare"
  document.getElementById("valueTag"+index).innerHTML = "Value"
  if(index != 5) document.getElementById("logicTag"+index).innerHTML = "Logic operator"
}
