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

var updateScriptTextarea = function(message, lang, expiresIn) {
  if (typeof message === 'undefined') throw('Missing message property');
  if (typeof lang === 'undefined') throw('Missing lang property');
  if (typeof expiresIn === 'undefined') throw('Missing expiresIn property');

  if (message === '') message = 'Hello, this is your message.';

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
'    \'Authorization\': \'Bearer ' + token + '\' // Expires in ' + expiresIn + '.\n' +
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

var token = '';
function getNewToken(expiresIn) {
  var xhrGetJWT = new XMLHttpRequest();
  xhrGetJWT.open('POST', '/getjwt', true);
  xhrGetJWT.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhrGetJWT.onload = function() {
    var jsonResponse = JSON.parse(xhrGetJWT.response);
    token = jsonResponse.token;
    document.getElementById('token').value = token;

    updateScriptTextarea(
      document.getElementById('message-input').value,
      document.getElementById('lang').value,
      document.getElementById('expiresInSelect').value
    );
  };
  xhrGetJWT.send('expiresIn=' + expiresIn);
}
getNewToken('1 year');
updateScriptTextarea('', 'en-US', '1 year');
