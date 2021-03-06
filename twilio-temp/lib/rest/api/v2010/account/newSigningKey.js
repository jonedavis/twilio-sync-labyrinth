'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var NewSigningKeyPage;
var NewSigningKeyList;
var NewSigningKeyInstance;
var NewSigningKeyContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.NewSigningKeyPage
 * @augments Page
 * @description Initialize the NewSigningKeyPage
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns NewSigningKeyPage
 */
/* jshint ignore:end */
function NewSigningKeyPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
}

_.extend(NewSigningKeyPage.prototype, Page.prototype);
NewSigningKeyPage.prototype.constructor = NewSigningKeyPage;

/* jshint ignore:start */
/**
 * Build an instance of NewSigningKeyInstance
 *
 * @function getInstance
 * @memberof Twilio.Api.V2010.AccountContext.NewSigningKeyPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns NewSigningKeyInstance
 */
/* jshint ignore:end */
NewSigningKeyPage.prototype.getInstance = function getInstance(payload) {
  return new NewSigningKeyInstance(
    this._version,
    payload,
    this._solution.accountSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.NewSigningKeyList
 * @description Initialize the NewSigningKeyList
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {string} accountSid -
 *          A 34 character string that uniquely identifies this resource.
 */
/* jshint ignore:end */
function NewSigningKeyList(version, accountSid) {
  /* jshint ignore:start */
  /**
   * @function newSigningKeys
   * @memberof Twilio.Api.V2010.AccountContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Api.V2010.AccountContext.NewSigningKeyContext}
   */
  /* jshint ignore:end */
  function NewSigningKeyListInstance(sid) {
    return NewSigningKeyListInstance.get(sid);
  }

  NewSigningKeyListInstance._version = version;
  // Path Solution
  NewSigningKeyListInstance._solution = {
    accountSid: accountSid
  };
  NewSigningKeyListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/SigningKeys.json' // jshint ignore:line
  )(NewSigningKeyListInstance._solution);
  /* jshint ignore:start */
  /**
   * create a NewSigningKeyInstance
   *
   * @function create
   * @memberof Twilio.Api.V2010.AccountContext.NewSigningKeyList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} opts.accountSid - The account_sid
   * @param {string} [opts.friendlyName] - The friendly_name
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed NewSigningKeyInstance
   */
  /* jshint ignore:end */
  NewSigningKeyListInstance.create = function create(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'FriendlyName': opts.friendlyName
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new NewSigningKeyInstance(
        this._version,
        payload
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

  return NewSigningKeyListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.NewSigningKeyInstance
 * @description Initialize the NewSigningKeyContext
 *
 * @property {string} sid - The sid
 * @property {string} friendlyName - The friendly_name
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} secret - The secret
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} payload - The instance payload
 */
/* jshint ignore:end */
function NewSigningKeyInstance(version, payload, accountSid) {
  this._version = version;

  // Marshaled Properties
  this.sid = payload.sid; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.dateCreated = deserialize.rfc2822DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.rfc2822DateTime(payload.date_updated); // jshint ignore:line
  this.secret = payload.secret; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
  };
}

module.exports = {
  NewSigningKeyPage: NewSigningKeyPage,
  NewSigningKeyList: NewSigningKeyList,
  NewSigningKeyInstance: NewSigningKeyInstance,
  NewSigningKeyContext: NewSigningKeyContext
};
