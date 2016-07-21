# twilio-sync-labyrinth
Hack Marketing with Twilio Sync and labyrinth

## Running Locally

1. Clone this repo.
1. From within directory: `npm install`
1. From within the `twilio-temp` directory, also: `npm install`
1. Copy `config.sample.js` to `config.js`
1. Edit parameters in `config.js`
1. Create ngrok tunnel to port 3000: `ngrok http 3000`
1. Copy ngrok URL into `config.js`
1. Run: `node app.js`
1. Open ngrok url in desktop browser.
