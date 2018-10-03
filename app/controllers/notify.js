const fs = require('fs');
const jwt = require('jsonwebtoken');
const sha256 = require('js-sha256');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

module.exports = (req, res) => {
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
      console.log('Invalid token.');
    } else {
      let voiceLang = 'en-US';
      if (typeof req.body.lang !== 'undefined' && req.body.lang !== '')
        voiceLang = req.body.lang;

      let audiofile = sha256(req.body.message + (req.body.phonetics || '') + voiceLang);
      audiofile = audiofile.substr(0, 12);
      audiofile += '.mp3';

      if (fs.existsSync('app/public/audios/' + audiofile)) {
        req.app.get('io')
          .sockets.emit('notify', { audiofile: audiofile, message: req.body.message });
        res.json({
          message: 'Notification played.'
        });
        return;
      }

      client.synthesizeSpeech({
          input: { text: req.body.phonetics || req.body.message },
          voice: { languageCode: voiceLang, ssmlGender: 'FEMALE' },
          // voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        }, (err, response) => {
        if (err) {
          console.error('Can\'t access Google Cloud services.');
          // console.error('ERROR:', err);
          res.status(503).json({
            message: 'Can\'t access Google Cloud services.'
          });
          return;
        }

        fs.writeFile('app/public/audios/' + audiofile, response.audioContent, 'binary', err => {
          if (err) { console.error('ERROR:', err); return; }

          if (typeof req.body.message !== 'string') throw 'Wrong post data format.';

          req.app.get('io')
            .sockets.emit('notify', { audiofile: audiofile, message: req.body.message });

          res.json({
            message: 'Notified.'
          });
        });
      });
    }
  });
}
