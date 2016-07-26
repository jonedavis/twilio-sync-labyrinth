# twilio-sync-labyrinth aka CommsQuest IV.
A WebGL maze game built with Twilio, Three.js, and Box2dWeb. CommsQuest IV uses your mobile phone and it's accelerometer as a controller. Your mission is to escape a unique world filled with crazy passages and secret chambers!

## Play it here
Are you ready for the challenge? Take it for a spin in your desktop browser:

(CommsQuest IV](http://bit.ly/2aeY8Ar)

After you enter your phone number you will receive a text message with a link. Click the link to sync your mobile phone with your desktop browser.

## Getting Started
To follow along at home you’ll need:

1. [A free Twilio account](https://www.twilio.com/try-twilio)
2. [Node installed](https://nodejs.org/en/download/)
3. [Ngrok](https://ngrok.com/)

## Twilio products used
#### [Twilio Sync](https://www.twilio.com/sync/api) - 
Synchronize application state across mobile apps and websites in real-time.

#### [Programmable SMS](https://www.twilio.com/sms/api) - 
Exchange text and pictures around the world from any web or mobile app with one API.

## Motivation
This project stemmed from an intense 4 hour hack session. With 5 minutes remaining in the session, we finally got the ball to move on the screen. I'll never forget David yelling at the top of his lungs and everyone jumping up and down when we got it to work.

## Next Steps
There is still work to be done:

1. The ball movement needs to be smoothed out
2. There is no final level or end screen
3. Android and iPhone have inverse coordinates
4. The controller webpage could use some visuals

## How to run it locally
1. Clone this repo.
1. From within directory: `npm install`
1. From within the `twilio-temp` directory, also: `npm install`
1. Copy `config.sample.js` to `config.js`
1. Edit parameters in `config.js`
1. Create ngrok tunnel to port 3000: `ngrok http 3000`
1. Copy ngrok URL into `config.js`
1. Run: `node app.js`
1. Open ngrok url in desktop browser.

## Contributors
1. [Rye Terrell](https://github.com/wwwtyro) - creator of [Astray](https://github.com/wwwtyro/Astray)
2. [Jon Davis](https://github.com/jonedavis)
3. [David Prothero](https://github.com/dprothero/)
4. Ari Sigal
5. [Eddie Zaneski](https://github.com/eddiezane)
5. Nathan Sharp
6. Sean McBride
7. [Brent Schooley](https://github.com/brentschooley/)

## License
MIT