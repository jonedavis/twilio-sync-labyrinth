'use strict';

var _ = require('lodash');
var EventsList = require('./call/events').EventsList;
var MetricsList = require('./call/metrics').MetricsList;
var Page = require('../../../base/Page');
var SummaryList = require('./call/summary').SummaryList;

var CallPage;
var CallList;
var CallInstance;
var CallContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallPage
 * @augments Page
 * @description Initialize the CallPage
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {object} response - Response from the API
 *
 * @returns CallPage
 */
/* jshint ignore:end */
function CallPage(version, response) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {};
}

_.extend(CallPage.prototype, Page.prototype);
CallPage.prototype.constructor = CallPage;

/* jshint ignore:start */
/**
 * Build an instance of CallInstance
 *
 * @function getInstance
 * @memberof Twilio.Preview.Insights.CallPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns CallInstance
 */
/* jshint ignore:end */
CallPage.prototype.getInstance = function getInstance(payload) {
  return new CallInstance(
    this._version,
    payload
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallList
 * @description Initialize the CallList
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 */
/* jshint ignore:end */
function CallList(version) {
  /* jshint ignore:start */
  /**
   * @function calls
   * @memberof Twilio.Preview.Insights
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Preview.Insights.CallContext}
   */
  /* jshint ignore:end */
  function CallListInstance(sid) {
    return CallListInstance.get(sid);
  }

  CallListInstance._version = version;
  // Path Solution
  CallListInstance._solution = {};
  return CallListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallInstance
 * @description Initialize the CallContext
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {object} payload - The instance payload
 */
/* jshint ignore:end */
function CallInstance(version, payload) {
  this._version = version;

  // Context
  this._context = undefined;
  this._solution = {};
}

/* jshint ignore:start */
/**
 * Access the events
 *
 * @function events
 * @memberof Twilio.Preview.Insights.CallInstance
 * @instance
 *
 * @returns {Twilio.Preview.Insights.CallContext.EventsList}
 */
/* jshint ignore:end */
CallInstance.prototype.events = function events() {
  return this._proxy.events;
};

/* jshint ignore:start */
/**
 * Access the metrics
 *
 * @function metrics
 * @memberof Twilio.Preview.Insights.CallInstance
 * @instance
 *
 * @returns {Twilio.Preview.Insights.CallContext.MetricsList}
 */
/* jshint ignore:end */
CallInstance.prototype.metrics = function metrics() {
  return this._proxy.metrics;
};

/* jshint ignore:start */
/**
 * Access the summary
 *
 * @function summary
 * @memberof Twilio.Preview.Insights.CallInstance
 * @instance
 *
 * @returns {Twilio.Preview.Insights.CallContext.SummaryList}
 */
/* jshint ignore:end */
CallInstance.prototype.summary = function summary() {
  return this._proxy.summary;
};

module.exports = {
  CallPage: CallPage,
  CallList: CallList,
  CallInstance: CallInstance,
  CallContext: CallContext
};
