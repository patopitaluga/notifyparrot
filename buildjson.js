const envVars = require('dotenv').config();
const fs = require('fs');

fs.writeFileSync('creds/google-app-creds.json', JSON.stringify(
  {
    'type': process.env.GOOGLECREDS_TYPE,
    'project_id': process.env.GOOGLECREDS_PROJECTID,
    'private_key_id': process.env.GOOGLECREDS_KEYID,
    'private_key': process.env.GOOGLECREDS_KEY,
    'client_email': process.env.GOOGLECREDS_CLIENTEMAIL,
    'client_id': process.env.GOOGLECREDS_CLIENTID,
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
    'token_uri': 'https://oauth2.googleapis.com/token',
    'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
    'client_x509_cert_url': process.env.GOOGLECREDS_CERTURL,
  },
null, 2));
