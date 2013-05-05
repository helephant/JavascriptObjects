
if(typeof jQuery === "undefined") {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js";
	document.getElementsByTagName("head")[0].appendChild(script);
}

window.addEventListener("load", function() {
	var logger = new Logger();

	displayCodeFromScriptBlocks();
	wireUpRunButtons(logger);
});

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
	body.append("<style type='text/css'>" + style + "</style>");
}

function wireUpRunButtons(logger) {
	$(".run-button").click(function() {
		logger.clear();

		var sampleId = "#sample" + $(this).attr('sample');
		var sample = $(sampleId).text();
		eval(sample);
	});
}

function Logger() {
	var logElement;

	createOutputLog();
	rewriteLogMethod();	

	this.clear = function() {
		logElement.html("");
	}

	function createOutputLog() {
		var body = $("body");
		 body.after("<div id='output'></div>");
		 logElement = $("#output");

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
				margin: 10px; \
			} \
		";
		body.append("<style type='text/css'>" + style + "</style>");
	}

	function rewriteLogMethod() {
		console.originalLog = console.log;
		console.log = function() {
			logElement.append(Array.prototype.join.call(arguments, " ") + "\n");
			console.originalLog.apply(console, arguments);
		}
	}
}
