const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

let isThereAJsonFile = '';
fs.readdir(path.join(__dirname, '../creds'), (err, files) => {
  files.forEach((eachFile) => {
    if (isThereAJsonFile === '' && eachFile.slice(-5) === '.json')
      console.log(eachFile.slice(-5));
    if (isThereAJsonFile === '' && eachFile.slice(-5) === '.json')
      isThereAJsonFile = eachFile;
  });
  if (isThereAJsonFile !== '') {
    startPromt();
  } else {
    console.log('NotifyParrot requires a Text-to-speech Google Cloud service account key json file. Get it following these instructions https://cloud.google.com/docs/authentication/getting-started and copy it into the creds folder.');
  }
});

function startPromt() {
  let jsonAccountKey = prompt('Text-to-speech Google Cloud service account key json file? (' + isThereAJsonFile + ') ', isThereAJsonFile);
  let portInput = prompt('Which port should the NotifyParrot web server use? (3000) ', 3000);
  let urlInput = prompt('Which url will NotifyParrot web server use? (http://localhost) ', 'http://localhost');

  if (urlInput.slice(-1) === '/') urlInput = urlInput.substr(0, urlInput.length - 1);

  let secretGenerated = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++)
    secretGenerated += possible.charAt(Math.floor(Math.random() * possible.length));

  let doyEnvText = `PORT=${portInput}
SECRET=${secretGenerated}
URL=${urlInput}
GOOGLE_APPLICATION_CREDENTIALS="creds/${isThereAJsonFile}"
`;

  fs.writeFile(path.join(__dirname, '..', '.env'), doyEnvText, function(err) {
    if (err) return console.log(err);

    console.log('Setup done. Run: "npm run start"');
  });
}
