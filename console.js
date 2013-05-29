
if(typeof jQuery === "undefined") {
  var script = document.createElement("script");
  script.type = "text/javascript";
  //script.src = "http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js";
  script.src = "../jquery-2.0.1.min.js";
  document.getElementsByTagName("head")[0].appendChild(script);
}

window.addEventListener("load", function() {
  var logger = new Logger();

  displayCodeFromScriptBlocks();
  wireUpRunButtons(logger);

  /*
  $(".sample").keypress(function(e) {
    var selection = window.getSelection();
    if(e.keyCode == 13 && typeof window.getSelection != 'undefined' && selection.isCollapsed) {
      var range = selection.getRangeAt(0);

      var script = $(this).text();
      var beginningOfLine = script.lastIndexOf('\n', range.startOffset - 1);
      var indentation = calculateIndentation(script, beginningOfLine);
      var indentationNode = document.createTextNode("xxxx")
      range.insertNode(indentationNode);
      //range.setStart(this, range.startOffset + indentation);
      range.setStart(this, 1);
    }
  }); */
});

function calculateIndentation(value, startOffset) {
  var leadingSpaces = /^\s+/.exec(value.substring(startOffset));
  if(leadingSpaces && leadingSpaces.length > 0) {
    return leadingSpaces[0].length;
  }
  return 0;
}

function displayCodeFromScriptBlocks() {
  var scripts = $("script:not([src])");
  var body = $("body");
  for(var x=0; x<scripts.length; x++) {
    var script = $(scripts[x]).html();
    script = cleanScriptText(script);

    body.append("<div class='sample' id='sample" + x + "' contenteditable='true'></div>");
    $("#sample" + x).text(script);
    body.append("<input type='button' value='run' class='run-button' sample='" + x + "' />")
  }

  var style = " \
    .sample { \
      background-color: #F6F6F6; \
      font-family: monospace; \
      white-space:pre; \
      padding: 7px; \
      /* font-size: 2em; */ \
    } \
  ";
  body.append("<style type='text/css'>" + style + "</style>");
}

function cleanScriptText(script)
{ 
  script = script.replace(/^\n/, ""); // trim first line
  script = script.replace('\t', "  "); // tabs tp spaces

  var indentation = calculateIndentation(script);
  if(indentation > 0)
    script = script.replace(new RegExp("^( ){" + indentation +"}", "gm"), "");

  return script;
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
  captureErrors();

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
        white-space:pre; \
        /* font-size: 2em; */ \
      } \
    ";
    body.append("<style type='text/css'>" + style + "</style>");
  }

  function log() {
    logElement.append(Array.prototype.join.call(arguments, " ") + "\n");
  }
  function error() {
    log("<span style='color:LightPink'>" + Array.prototype.join.call(arguments, " ") + "</span>\n");
  }

  function rewriteLogMethod() {
    console.originalLog = console.log;
    console.log = function() {
      log.apply(this, arguments);
      console.originalLog.apply(console, arguments);
    }
  }

  function captureErrors() {
    window.onerror = function(message, file, line) { 
      error(message);
    };
  }
}
