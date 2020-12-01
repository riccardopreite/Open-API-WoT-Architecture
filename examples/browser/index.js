/**
 * In the browser, node wot only works in client mode with limited binding support.
 * Supported bindings: HTTP / HTTPS / WebSockets
 *
 * After adding the following <script> tag to your HTML page:
 * <script src="https://cdn.jsdelivr.net/npm/@node-wot/browser-bundle@latest/dist/wot-bundle.min.js" defer></script>
 *
 * you can access all node-wot functionality / supported packages through the "Wot" global object.
 * Examples:
 * var servient = new Wot.Core.Servient();
 * var client = new Wot.Http.HttpClient();
 *
 **/
var propertyDict = {},text = ""
function get_td(addr) {
	servient.start().then((thingFactory) => {
		helpers.fetch(addr).then((td) => {
			thingFactory.consume(td)
			.then((thing) => {
				removeInteractions();
				showInteractions(thing);
			});
		}).catch((error) => {
			window.alert("Could not fetch TD.\n" + error)
		})
	})
}

function recursiveText(res){
	for(var key in res){
		if(typeof res[key] == typeof {}) recursiveText(res[key])
		else text += "	"+key+":	"+res[key]+";\n"
	}
}

function showInteractions(thing) {
	let td = thing.getThingDescription();
	propertyDict = {}
	for ( let property in td.properties ) {
		if (td.properties.hasOwnProperty(property)) {
			propertyDict[property] = property
			let item = document.createElement("li");
			let link = document.createElement("a");
			link.appendChild(document.createTextNode(property));
			item.appendChild(link);
			document.getElementById("properties").appendChild(item);

			item.onclick = (click) => {
				thing.readProperty(property)
				.then(res => {
					text = property+":\n"
					if(typeof res == typeof {}) recursiveText(res)
					else text += "	" + res
					window.alert(text)
				})
				.catch(err => window.alert("error: " + err))
			}
		}
	};
	for ( let action in td.actions ) {
		if (td.actions.hasOwnProperty(action)) {
			let item = document.createElement("li");
			let button = document.createElement("button");
			button.appendChild(document.createTextNode(action));
			button.className = "button tiny secondary"
			item.appendChild(button)
			document.getElementById("actions").appendChild(item);

			item.onclick = (click) => {
				showSchemaEditor(action, thing)
			}
		}
	};
	let eventSubscriptions = {}
	for ( let evnt in td.events ) {
		if (td.events.hasOwnProperty(evnt)) {
			let item = document.createElement("li");
			let link = document.createElement("a");
			link.appendChild(document.createTextNode(evnt));

			let checkbox = document.createElement("div");
			checkbox.className = "switch small"
			checkbox.innerHTML = '<input id="' + evnt + '" type="checkbox">\n<label for="' + evnt + '"></label>'
			item.appendChild(link);
			item.appendChild(checkbox)
			document.getElementById("events").appendChild(item);

			checkbox.onclick = (click) => {
				if (document.getElementById(evnt).checked && !eventSubscriptions[evnt]) {
					eventSubscriptions[evnt] = thing.events[evnt].subscribe(
						(response) => { window.alert("Event " + evnt + " detected\nMessage: " + response); },
						(error) => { window.alert("Event " + evnt + " error\nMessage: " + error); }
					)
				} else if (!document.getElementById(evnt).checked && eventSubscriptions[evnt]) {
					eventSubscriptions[evnt].unsubscribe();
				}
			}
		}
	};
	// Check if visible
	let placeholder = document.getElementById("interactions")
	if ( placeholder.style.display === "none") {
		placeholder.style.display = "block"
	}
}

function removeInteractions() {
	for (id of ["properties", "actions", "events"]) {
		let placeholder = document.getElementById(id);
		while (placeholder.firstChild){
			placeholder.removeChild(placeholder.firstChild);
		}
	}
}

function showSchemaEditor(action, thing) {
	let td = thing.getThingDescription();
	console.log(td.title);
	// Remove old editor
	removeSchemaEditor()
	let placeholder = document.getElementById('editor_holder');
	let editor;
	if (td.actions[action] && td.actions[action].input ) {
		var textProperty = ""
		console.log(textProperty);
		for(var key in propertyDict){
			textProperty += key + "!!"
			console.log(key);
		}
		try{
			if(!td.actions[action].form.prop) textProperty = ""
			}
		catch(e){
			console.log("PROP NOT DEFINED");
		}
		try{
			td.actions[action].input.title = action + " " + textProperty +" ("+ td.actions[action].form.type+")";
			}
		catch(e){
			console.log("formtype NOT DEFINED"); td.actions[action].input.title = action + " " + textProperty;
		}
		
		editor = new JSONEditor(
  			placeholder,
  			{
  				schema: td.actions[action].input.title,
  				form_name_root: action
  			}
  		);
		console.log(editor)
	}
	// Add invoke button
	let button = document.createElement("button")
	button.appendChild(document.createTextNode("Invoke"))
	placeholder.appendChild(button)

	button.onclick = () => {
		let input = editor ? editor.getValue() : "";
		thing.invokeAction(action, input)
		.then((res) => {
			if (res) {
				console.log("ALTRO");
				console.log(res);
				if(typeof res == typeof {}){
					download(action+"_"+td.title.replace(" ","_")+".json",res);
				}
				else window.alert("Success! Received response: " + res)
			} else {
				window.alert("Not Executed")
			}
		})
		.catch((err) => {
      window.alert("Input must be of the form of: " + td.actions[action].form.type);
     })
		removeSchemaEditor()
	};
}

function removeSchemaEditor() {
	let placeholder = document.getElementById('editor_holder');
	placeholder.innerHTML = ""
	console.log("CAIOOOOOOOOOO");
	console.log(placeholder);
	// while (placeholder.firstChild){
	// 	console.log("removeee");
  //   	placeholder.removeChild(placeholder.firstChild);
	// }
}

function download(filename, text) {
  var element = document.createElement('a');
	element.innerHTML = filename
	element.setAttribute('id', 'download');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(text)));
  element.setAttribute('download', filename);

	$('.modal-body').append(element)
	$("#download").click(function () {
		$('#responseModal').modal('hide');
		$('#download').remove()

	})
	$('#responseModal').modal('show')
	$('#primary').text("Download")
	$('#secondary').text("Cancel")
	$('#primary').click(function() {
		element.click()
		$('#responseModal').modal('hide')
		$('#download').remove()
	})
	$('#secondary').click(function() {
		$('#responseModal').modal('hide')
		$('#download').remove()
	})
	$('#text').text("Success! Received response: ")

}

var servient = new Wot.Core.Servient();
servient.addClientFactory(new Wot.Http.HttpClientFactory());
var helpers = new Wot.Core.Helpers(servient);
document.getElementById("fetch").onclick = () => { removeSchemaEditor();get_td(document.getElementById("td_addr").value);  };
