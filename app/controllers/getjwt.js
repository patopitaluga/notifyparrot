const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  let randomString = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++)
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));

  let token = jwt.sign({
    iss: randomString
  }, process.env.SECRET, {
    expiresIn: 1440 // expires in 24 hours
  });
  res.json({
    message: 'Authentication OK.',
    token: token
  });
}
