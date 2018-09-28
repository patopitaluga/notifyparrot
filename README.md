#  NotifyParrot

**NotifyParrot** is a node service that creates a web page that turns POST requests into spoken voice messages.

Receive voice messages in real time in your browser when your web deploy process ends, when your testing script ends, when your preprocessor ends, when your Arduino gadgets detect something, or whenever you can imagine.

### Prerequisites

**NotifyParrot** requires the Google Cloud Text‑to‑Speech service. You'll need a json file with your Google Cloud service [account key](https://cloud.google.com/docs/authentication/getting-started).**

## Setup
* Clone the package
  ```
  git clone https://github.com/patopitaluga/notifyparrot.git
  ```
* Copy your Text-to-speech Google Cloud service account key json file into the *creds* folder.

* Set the configuration
  ```
  npm run setup
  ```
  Or create the *.env* file using the *.env.sample* file as a template, or set the environment variables.

* Run the server
  ```
  npm run start
  ```
* Open the created web server in your browser. Follow the instructions to create the POST request with your messages.

## Security

**NotifyParrot** will generate a unique *secret* and will provide a json web token to use in every POST request.

## Options

In yout POST request you can set a *message*, and message with different *phonetics* and chose the *lang* in which the message will be spoken.

-----------------------

Created by: https://github.com/patopitaluga patricio.pitaluga@gmail.com License ISC: Use, copy, modify, and/or distribute this software for any
purpose with or without fee; provided "as is" without warranties; I'm not responsable for damages caused by the use of this software. 2018.
