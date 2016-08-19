'use strict';
function prettyPrint(obj) {
    console.log(JSON.stringify(obj, null, 2));
}
exports.prettyPrint = prettyPrint;
var Twilio = require('../../index');
var client = new Twilio('ACxx', 'secret');
var Sync = client.preview.sync;
exports.Sync = Sync;
function createInstance(opts) {
    console.log('Creating Service Instance');
    return Sync.services.create(opts)
        .then(function (result) {
        console.log("Created Service Instance " + result.sid);
        return result;
    });
}
exports.createInstance = createInstance;
function removeInstance(si) {
    console.log("Removing Service Instance " + si.sid);
    return si.remove()
        .then(function (success) {
        console.log("Removed Service Instance " + si.sid);
        return success;
    });
}
exports.removeInstance = removeInstance;
