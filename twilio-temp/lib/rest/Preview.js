'use strict';

var _ = require('lodash');
var Domain = require('../base/Domain');
var Insights = require('./preview/Insights');
var Sync = require('./preview/Sync');
var Wireless = require('./preview/Wireless');


/* jshint ignore:start */
/**
 * Initialize preview domain
 *
 * @constructor Twilio.Preview
 *
 * @property {Twilio.Preview.Sync} sync - sync version
 * @property {Twilio.Preview.Wireless} wireless - wireless version
 * @property {Twilio.Preview.Insights} insights - insights version
 * @property {Twilio.Preview.Sync.ServiceList} services - services resource
 * @property {Twilio.Preview.Wireless.CommandList} commands - commands resource
 * @property {Twilio.Preview.Wireless.DeviceList} devices - devices resource
 * @property {Twilio.Preview.Wireless.RatePlanList} ratePlans - ratePlans resource
 * @property {Twilio.Preview.Insights.CallList} calls - calls resource
 *
 * @param {Twilio} twilio - The twilio client
 */
/* jshint ignore:end */
function Preview(twilio) {
  Domain.prototype.constructor.call(this, twilio, 'https://preview.twilio.com');

  // Versions
  this._sync = undefined;
  this._wireless = undefined;
  this._insights = undefined;
}

_.extend(Preview.prototype, Domain.prototype);
Preview.prototype.constructor = Preview;

Object.defineProperty(Preview.prototype,
  'sync', {
  get: function() {
    this._sync = this._sync || new Sync(this);
    return this._sync;
  },
});

Object.defineProperty(Preview.prototype,
  'wireless', {
  get: function() {
    this._wireless = this._wireless || new Wireless(this);
    return this._wireless;
  },
});

Object.defineProperty(Preview.prototype,
  'insights', {
  get: function() {
    this._insights = this._insights || new Insights(this);
    return this._insights;
  },
});

Object.defineProperty(Preview.prototype,
  'services', {
  get: function() {
    return this.sync.services;
  },
});

Object.defineProperty(Preview.prototype,
  'commands', {
  get: function() {
    return this.wireless.commands;
  },
});

Object.defineProperty(Preview.prototype,
  'devices', {
  get: function() {
    return this.wireless.devices;
  },
});

Object.defineProperty(Preview.prototype,
  'ratePlans', {
  get: function() {
    return this.wireless.ratePlans;
  },
});

Object.defineProperty(Preview.prototype,
  'calls', {
  get: function() {
    return this.insights.calls;
  },
});

module.exports = Preview;
