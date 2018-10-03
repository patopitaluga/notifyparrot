const jwt = require('jsonwebtoken');
const ms = require('ms');

module.exports = (req, res) => {
  let expiresIn = '1 year';
  if (typeof req.body.expiresIn !== 'undefined') {
    if (typeof req.body.expiresIn !== 'string') throw('Wrong expiresIn variable format.');

    let checkValidExpiresIn = ms(req.body.expiresIn);
    if (typeof checkValidExpiresIn === 'undefined') throw('Wrong expiresIn variable format.');
    expiresIn = req.body.expiresIn;
  }

  let randomString = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++)
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));

  let token = jwt.sign({
    iss: randomString
  }, process.env.SECRET, {
    expiresIn: expiresIn
  });

  res.json({
    message: 'Authentication OK.',
    token: token
  });
}
