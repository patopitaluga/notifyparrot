function addZero(i) {
  if (i < 10) i = "0" + i;
  return i;
}

/* global io */
var socket = io('/');
socket.on('notify', function(data) {
  var audio = new Audio('/audios/' + data.audiofile);

  var d = new Date();
  document.getElementById('output').innerHTML += addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ' ' + data.message + "\n";
  audio.pause();
  audio.currentTime = 0;
  audio.play();
});

var serverUrl = window.location.href.replace('http://', '').replace('https://', '');
if (serverUrl.slice(-1) === '/') serverUrl = serverUrl.substr(0, serverUrl.length - 1);
let serverPort = 80;
if (serverUrl.indexOf(':') > -1) {
  serverPort = serverUrl.substr(serverUrl.lastIndexOf(':') + 1);
  serverUrl = serverUrl.substr(0, serverUrl.indexOf(':'));
}

var token = '';
function generateNotif() {
  document.body.classList.remove('body--untouched');

  document.getElementById('generate-notif').classList.remove('generate-notif--hidden');
  document.getElementById('message-input').focus();

  updateScriptTextarea('Hello, this is your message.', 'en-US');

  var xhrGetJWT = new XMLHttpRequest();
  xhrGetJWT.open('POST', '/getjwt', true);
  xhrGetJWT.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhrGetJWT.onload = function() {
    var jsonResponse = JSON.parse(xhrGetJWT.response);
    token = jsonResponse.token;
    document.getElementById('token').value = token;
  };
  xhrGetJWT.send();
}

var updateScriptTextarea = function(message, lang) {
  document.getElementById('codeNode').value =
'const http = require(\'http\');\n' +
'const querystring = require(\'querystring\');\n' +
'\n' +
'let message = \'' + message + '\';\n' +
'\n' +
'let postData = querystring.stringify({\n' +
'  message: message,\n' +
'  lang: \'' + lang + '\'\n' +
'});\n' +
'\n' +
'let req = http.request({\n' +
'  hostname: \'' + serverUrl + '\',\n' +
'  port: ' + serverPort + ',\n' +
'  path: \'/notify\',\n' +
'  method: \'POST\',\n' +
'  headers: {\n' +
'    \'Content-Type\': \'application/x-www-form-urlencoded\',\n' +
'    \'Authorization\': \'Bearer ' + token + '\'\n' +
'  }\n' +
'}, function (res) {\n' +
'  console.log(\'NotifyParrot: \' + message);\n' +
'});\n' +
'\n' +
'req.on(\'error\', function (e) {\n' +
'});\n' +
'\n' +
'req.write(postData);\n' +
'req.end();\n';
}
