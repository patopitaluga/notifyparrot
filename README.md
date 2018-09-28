#  NotifyParrot

**NotifyParrot** is a node service that creates a web page that turns POST requests into spoken voice messages.

Receive voice messages in real time in your browser when your web deploy process ends, when your testing script ends, when your preprocessor ends, when your Arduino gadgets detect something, or whenever you can imagine.

**NotifyParrot requires the Google Cloud Text‑to‑Speech service. You'll need a json file with your Google Cloud service [account key](https://cloud.google.com/docs/authentication/getting-started).**

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
