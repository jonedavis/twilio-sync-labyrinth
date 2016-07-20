'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var EventsPage;
var EventsList;
var EventsInstance;
var EventsContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.EventsPage
 * @augments Page
 * @description Initialize the EventsPage
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} sid - The sid
 *
 * @returns EventsPage
 */
/* jshint ignore:end */
function EventsPage(version, response, sid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    sid: sid
  };
}

_.extend(EventsPage.prototype, Page.prototype);
EventsPage.prototype.constructor = EventsPage;

/* jshint ignore:start */
/**
 * Build an instance of EventsInstance
 *
 * @function getInstance
 * @memberof Twilio.Preview.Insights.CallContext.EventsPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns EventsInstance
 */
/* jshint ignore:end */
EventsPage.prototype.getInstance = function getInstance(payload) {
  return new EventsInstance(
    this._version,
    payload,
    this._solution.sid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.EventsList
 * @description Initialize the EventsList
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {string} sid - The sid
 */
/* jshint ignore:end */
function EventsList(version, sid) {
  /* jshint ignore:start */
  /**
   * @function events
   * @memberof Twilio.Preview.Insights.CallContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Preview.Insights.CallContext.EventsContext}
   */
  /* jshint ignore:end */
  function EventsListInstance(sid) {
    return EventsListInstance.get(sid);
  }

  EventsListInstance._version = version;
  // Path Solution
  EventsListInstance._solution = {
    sid: sid
  };
  EventsListInstance._uri = _.template(
    '/Calls/<%= callSid %>/Events' // jshint ignore:line
  )(EventsListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams EventsInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Preview.Insights.CallContext.EventsList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.callSid - The call_sid
   * @param {string} [opts.level] - The level
   * @param {string} [opts.group] - The group
   * @param {string} [opts.name] - The name
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  EventsListInstance.each = function each(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.callSid)) {
      throw new Error('Required parameter "opts.callSid" missing.');
    }
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /* jshint ignore:start */
  /**
   * @description Lists EventsInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Preview.Insights.CallContext.EventsList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.callSid - The call_sid
   * @param {string} [opts.level] - The level
   * @param {string} [opts.group] - The group
   * @param {string} [opts.name] - The name
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  EventsListInstance.list = function list(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.callSid)) {
      throw new Error('Required parameter "opts.callSid" missing.');
    }
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of EventsInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Preview.Insights.CallContext.EventsList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.callSid - The call_sid
   * @param {string} [opts.level] - The level
   * @param {string} [opts.group] - The group
   * @param {string} [opts.name] - The name
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  EventsListInstance.page = function page(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.callSid)) {
      throw new Error('Required parameter "opts.callSid" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'CallSid': opts.callSid,
      'Level': opts.level,
      'Group': opts.group,
      'Name': opts.name,
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new EventsPage(
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

  return EventsListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.EventsInstance
 * @description Initialize the EventsContext
 *
 * @property {string} name - The name
 * @property {string} group - The group
 * @property {string} publisher - The publisher
 * @property {Date} timestamp - The timestamp
 * @property {string} level - The level
 * @property {string} payloadType - The payload_type
 * @property {string} accountSid - The account_sid
 * @property {string} parentAccountSid - The parent_account_sid
 * @property {string} accountFriendlyName - The account_friendly_name
 * @property {string} parentAccountFriendlyName - The parent_account_friendly_name
 * @property {string} sid - The sid
 * @property {string} payload - The payload
 * @property {string} publisherMetadata - The publisher_metadata
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {object} payload - The instance payload
 */
/* jshint ignore:end */
function EventsInstance(version, payload, sid) {
  this._version = version;

  // Marshaled Properties
  this.name = payload.name; // jshint ignore:line
  this.group = payload.group; // jshint ignore:line
  this.publisher = payload.publisher; // jshint ignore:line
  this.timestamp = deserialize.iso8601DateTime(payload.timestamp); // jshint ignore:line
  this.level = payload.level; // jshint ignore:line
  this.payloadType = payload.payload_type; // jshint ignore:line
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.parentAccountSid = payload.parent_account_sid; // jshint ignore:line
  this.accountFriendlyName = payload.account_friendly_name; // jshint ignore:line
  this.parentAccountFriendlyName = payload.parent_account_friendly_name; // jshint ignore:line
  this.sid = payload.sid; // jshint ignore:line
  this.payload = payload.payload; // jshint ignore:line
  this.publisherMetadata = payload.publisher_metadata; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    sid: sid,
  };
}

module.exports = {
  EventsPage: EventsPage,
  EventsList: EventsList,
  EventsInstance: EventsInstance,
  EventsContext: EventsContext
};
