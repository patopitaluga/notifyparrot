const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const sha256 = require('js-sha256');
const envVars = require('dotenv').config();
const path = require('path');
const envConfig = envVars.parsed;
// Rewrite env vars from system.
for (let k in envConfig) {
  process.env[k] = envConfig[k];
}
const jwt = require('jsonwebtoken');
const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();
const cors = require('cors');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.log('NotifyParrot requires a Text-to-speech Google Cloud service account key json file.');
  console.log('Get it following these instructions https://cloud.google.com/docs/authentication/getting-started and copy it into the creds folder.');
  console.log('Then run: npm run setup');
  process.exit();
}

app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public')));

let port = 3000;
if (process.env.PORT) port = process.env.PORT;
server.listen(port);
console.log('Listening on port ' + port);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

let randomString = '';
let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for (let i = 0; i < 16; i++)
  randomString += possible.charAt(Math.floor(Math.random() * possible.length));

app.post('/getjwt', (req, res) => {
  let token = jwt.sign({
    iss: randomString
  }, process.env.SECRET, {
    expiresIn: 1440 // expires in 24 hours
  });
  res.json({
    message: 'Authentication OK.',
    token: token
  });
});

app.post('/notify', function (req, res) {
  let token = req.headers.authorization;
  if (!token) {
    res.status(401).send({
      error: 'Token required.'
    });
    return;
  }
  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.SECRET, function(err, user) {
    if (err) {
      res.status(401).send({
        error: 'Invalid token.'
      });
    } else {
      let audiofile = sha256(req.body.message + (req.body.phonetics || ''));
      audiofile = audiofile.substr(0, 12);
      audiofile += '.mp3';

      if (fs.existsSync('app/public/audios/' + audiofile)) {
        io.sockets.emit('notify', { audiofile: audiofile, message: req.body.message });
        res.send('1');
        return;
      }

      let voiceLang = 'en-US';
      if (typeof req.body.lang !== 'undefined' && req.body.lang !== '')
        voiceLang = req.body.lang;
      client.synthesizeSpeech({
          input: { text: req.body.phonetics || req.body.message },
          voice: { languageCode: voiceLang, ssmlGender: 'FEMALE' },
          // voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        }, (err, response) => {
        if (err) { console.error('ERROR:', err); return; }

        fs.writeFile('app/public/audios/' + audiofile, response.audioContent, 'binary', err => {
          if (err) { console.error('ERROR:', err); return; }

          if (typeof req.body.message !== 'string') throw 'Wrong post data format.';

          io.sockets.emit('notify', { audiofile: audiofile, message: req.body.message });
          res.send('1');
        });
      });
    }
  });
});

io.on('connection', function(socket) {
});

app.get('/getnotificationfile', (req, res) => {
  let serverUrl = req.get('host') + req.originalUrl;
  if (serverUrl.slice(-1) === '/') serverUrl = serverUrl.substr(0, serverUrl.length - 1);
  let serverPort = 80;
  if (serverUrl.indexOf(':') > -1) {
    serverPort = serverUrl.substr(serverUrl.lastIndexOf(':') + 1);
    serverPort = serverPort.substr(0, serverPort.indexOf('/'));
    serverUrl = serverUrl.substr(0, serverUrl.indexOf(':'));
  }

  let codeStr =
  'const http = require(\'http\');\n' +
  'const querystring = require(\'querystring\');\n' +
  '\n' +
  'let message = \'Hello, this is your message.\';\n' +
  '\n' +
  'let postData = querystring.stringify({\n' +
  '  message: message\n' +
  '});\n' +
  '\n' +
  'let req = http.request({\n' +
  '  hostname: \'' + serverUrl + '\',\n' +
  '  port: ' + serverPort + ',\n' +
  '  path: \'/notify\',\n' +
  '  method: \'POST\',\n' +
  '  headers: {\n' +
  '    \'Content-Type\': \'application/x-www-form-urlencoded\',\n' +
  '    \'Content-Length\': postData.length,\n' +
  '    \'Authorization\': \'Bearer ' + req.query.jwt + '\'\n' +
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

  res.set('Content-Type', 'application/javascript');
  res.set('Content-Disposition', 'attachment; filename=notifyparrotmessage.js');

  res.send(codeStr);
});
