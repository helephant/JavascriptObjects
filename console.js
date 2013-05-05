if(typeof jQuery === "undefined") {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js";
	document.getElementsByTagName("head")[0].appendChild(script);
}

window.addEventListener("load", function() {
	rewriteLogMethod();

	displayCodeFromScriptBlocks();
	wireUpRunButtons();

	createOutputLog();
});

function rewriteLogMethod() {
	console.originalLog = console.log;
	console.log = function() {
		$("#output").append(Array.prototype.join.call(arguments, " ") + "\n");
		console.originalLog.apply(console, arguments);
	}
}

function displayCodeFromScriptBlocks() {
	var scripts = $("script:not([src])");
	var body = $("body");
	for(var x=0; x<scripts.length; x++) {
		body.append("<div class='sample' style='white-space:pre;' id='sample" + x + "' contenteditable='true'>" + $(scripts[x]).html() + '</div>');
		body.append("<input type='button' value='run' class='run-button' sample='" + x + "' />")
	}

	var style = " \
		.sample { \
			background-color: #F6F6F6; \
			font-family: monospace; \
		} \
	";
	addStyle(style);
}

function wireUpRunButtons() {
	$(".run-button").click(function() {
		var sampleId = "#sample" + $(this).attr('sample');
		var sample = $(sampleId).text();
		eval(sample);
	});
}

function createOutputLog() {
	var body = $("body");
	body.append("<div id='output'></div>")

	var style = " \
		.sample { \
			background-color: #F6F6F6; \
			font-family: monospace; \
		} \
		#output { \
			color: white; \
			background-color: gray; \
			font-family: monospace; \
			height: 200px; \
			overflow: scroll; \
			padding: 7px; \
		} \
	";
	addStyle(style);
}

function addStyle(style) {
	var body = $("body");
	body.append("<style type='text/css'>" + style + "</style>")
}
