const express = require('express');
const app = express();
const server = require('http').Server(app);
const envVars = require('dotenv').config();
const path = require('path');
const envConfig = envVars.parsed;
// Rewrite env vars from system.
for (let k in envConfig) {
  process.env[k] = envConfig[k];
}
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

app.set('io', require('socket.io')(server));

let port = 3000;
if (process.env.PORT) port = process.env.PORT;
server.listen(port);
console.log('Listening on port ' + port);

/* Routes */
app.get('/', require('./controllers/home'));
app.post('/getjwt', require('./controllers/getjwt'));
app.post('/notify', require('./controllers/notify'));
app.get('/getnotificationfile', require('./controllers/getnotificationfile'));
