var AccessToken = require('./twilio-temp').AccessToken;
var SyncGrant = AccessToken.SyncGrant;
var config = require('./config.js');

module.exports = function (phoneNumber) {
    // Create a unique ID for the client on their current device
    var endpointId = 'TwilioLabyrinth-' + phoneNumber;

    // Create a "grant" which enables a client to use Sync as a given user,
    // on a given device
    var syncGrant = new SyncGrant({
        serviceSid: config.serviceSid,
        endpointId: endpointId
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    var token = new AccessToken(
      config.accountSid,
      config.apiKey,
      config.apiSecret
    );
    token.addGrant(syncGrant);
    token.identity = phoneNumber;

    return {
        identity: phoneNumber,
        token: token.toJwt()
    };
}