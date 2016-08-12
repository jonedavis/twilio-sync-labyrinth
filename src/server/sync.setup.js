'use strict';

const AccessToken = require('../../twilio-temp').jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;
const config = require('../../config.js');

module.exports = function (phoneNumber) {
    // Create a unique ID for the client on their current device
    let endpointId = 'TwilioLabyrinth-' + phoneNumber;

    // Create a "grant" which enables a client to use Sync as a given user,
    // on a given device
    let syncGrant = new SyncGrant({
        serviceSid: config.serviceSid,
        endpointId: endpointId
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    let token = new AccessToken(
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