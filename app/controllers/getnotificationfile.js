module.exports = (req, res) => {
  let serverUrl = req.get('host') + req.originalUrl;
  if (serverUrl.slice(-1) === '/') serverUrl = serverUrl.substr(0, serverUrl.length - 1);
  let serverPort = 80;
  if (serverUrl.indexOf(':') > -1) {
    serverPort = serverUrl.substr(serverUrl.lastIndexOf(':') + 1);
    serverPort = serverPort.substr(0, serverPort.indexOf('/'));
    serverUrl = serverUrl.substr(0, serverUrl.indexOf(':'));
  }

  if (req.query.message === '' || typeof req.query.message === 'undefined')
    req.query.message = 'Hello, this is your message.';

  let codeStr =
  'const http = require(\'http\');\n' +
  'const querystring = require(\'querystring\');\n' +
  '\n' +
  'let postData = querystring.stringify({\n' +
  '  message: \'' + req.query.message + '\',\n' +
  '  lang: \'' + req.query.lang + '\'\n' +
  '});\n' +
  '\n' +
  'let req = http.request({\n' +
  '  hostname: \'' + serverUrl + '\',\n' +
  '  port: ' + serverPort + ',\n' +
  '  path: \'/notify\',\n' +
  '  method: \'POST\',\n' +
  '  headers: {\n' +
  '    \'Content-Type\': \'application/x-www-form-urlencoded\',\n' +
  '    \'Authorization\': \'Bearer ' + req.query.jwt + '\' // Expires in ' + req.query.expiresIn + '.\n' +
  '  }\n' +
  '}, function (res) {\n' +
  '  console.log(\'NotifyParrot: ' + req.query.message + '\');\n' +
  '});\n' +
  '\n' +
  'req.on(\'error\', function (e) {\n' +
  '});\n' +
  '\n' +
  'req.write(postData);\n' +
  'req.end();\n';

  res.set('Content-Type', 'application/javascript');
  res.set('Content-Disposition', 'attachment; filename=notifyparrotmessage.js');

  res.send(codeStr);
}
