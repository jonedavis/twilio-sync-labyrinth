'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var values = require('../../../../base/values');

var SummaryPage;
var SummaryList;
var SummaryInstance;
var SummaryContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.SummaryPage
 * @augments Page
 * @description Initialize the SummaryPage
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} sid - The sid
 *
 * @returns SummaryPage
 */
/* jshint ignore:end */
function SummaryPage(version, response, sid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    sid: sid
  };
}

_.extend(SummaryPage.prototype, Page.prototype);
SummaryPage.prototype.constructor = SummaryPage;

/* jshint ignore:start */
/**
 * Build an instance of SummaryInstance
 *
 * @function getInstance
 * @memberof Twilio.Preview.Insights.CallContext.SummaryPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns SummaryInstance
 */
/* jshint ignore:end */
SummaryPage.prototype.getInstance = function getInstance(payload) {
  return new SummaryInstance(
    this._version,
    payload,
    this._solution.sid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.SummaryList
 * @description Initialize the SummaryList
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {string} sid - The sid
 */
/* jshint ignore:end */
function SummaryList(version, sid) {
  /* jshint ignore:start */
  /**
   * @function summary
   * @memberof Twilio.Preview.Insights.CallContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Preview.Insights.CallContext.SummaryContext}
   */
  /* jshint ignore:end */
  function SummaryListInstance(sid) {
    return SummaryListInstance.get(sid);
  }

  SummaryListInstance._version = version;
  // Path Solution
  SummaryListInstance._solution = {
    sid: sid
  };
  /* jshint ignore:start */
  /**
   * Constructs a summary
   *
   * @function get
   * @memberof Twilio.Preview.Insights.CallContext.SummaryList
   * @instance
   *
   * @param {string} callSid - The call_sid
   *
   * @returns {Twilio.Preview.Insights.CallContext.SummaryContext}
   */
  /* jshint ignore:end */
  SummaryListInstance.get = function get(callSid) {
    return new SummaryContext(
      this._version,
      this._solution.sid,
      callSid
    );
  };

  return SummaryListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.SummaryInstance
 * @description Initialize the SummaryContext
 *
 * @property {string} accountSid - The account_sid
 * @property {string} parentAccountSid - The parent_account_sid
 * @property {string} accountFriendlyName - The account_friendly_name
 * @property {string} parentAccountFriendlyName - The parent_account_friendly_name
 * @property {string} summary - The summary
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} callSid - The call_sid
 */
/* jshint ignore:end */
function SummaryInstance(version, payload, sid, callSid) {
  this._version = version;

  // Marshaled Properties
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.parentAccountSid = payload.parent_account_sid; // jshint ignore:line
  this.accountFriendlyName = payload.account_friendly_name; // jshint ignore:line
  this.parentAccountFriendlyName = payload.parent_account_friendly_name; // jshint ignore:line
  this.summary = payload.summary; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    sid: sid,
    callSid: callSid || this.callSid,
  };
}

Object.defineProperty(SummaryInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new SummaryContext(
        this._version,
        this._solution.callSid
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * fetch a SummaryInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Insights.CallContext.SummaryInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SummaryInstance
 */
/* jshint ignore:end */
SummaryInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.SummaryContext
 * @description Initialize the SummaryContext
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {sid} callSid - The call_sid
 */
/* jshint ignore:end */
function SummaryContext(version, callSid) {
  this._version = version;

  // Path Solution
  this._solution = {
    callSid: callSid,
  };
  this._uri = _.template(
    '/Calls/<%= callSid %>/Summary' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * fetch a SummaryInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Insights.CallContext.SummaryContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SummaryInstance
 */
/* jshint ignore:end */
SummaryContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new SummaryInstance(
      this._version,
      payload,
      this._solution.callSid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

module.exports = {
  SummaryPage: SummaryPage,
  SummaryList: SummaryList,
  SummaryInstance: SummaryInstance,
  SummaryContext: SummaryContext
};
