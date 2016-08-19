'use strict';

var _ = require('lodash');
var CallList = require('./insights/call').CallList;
var Version = require('../../base/Version');


/* jshint ignore:start */
/**
 * Initialize the Insights version of Preview
 *
 * @constructor Twilio.Preview.Insights
 *
 * @property {Twilio.Preview.Insights.CallList} calls - calls resource
 *
 * @param {Twilio.Preview} domain - The twilio domain
 */
/* jshint ignore:end */
function Insights(domain) {
  Version.prototype.constructor.call(this, domain, 'insights');

  // Resources
  this._calls = undefined;
}

_.extend(Insights.prototype, Version.prototype);
Insights.prototype.constructor = Insights;

Object.defineProperty(Insights.prototype,
  'calls', {
  get: function() {
    this._calls = this._calls || new CallList(this);
    return this._calls;
  },
});

module.exports = Insights;
