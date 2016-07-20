'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var MetricsPage;
var MetricsList;
var MetricsInstance;
var MetricsContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.MetricsPage
 * @augments Page
 * @description Initialize the MetricsPage
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} sid - The sid
 *
 * @returns MetricsPage
 */
/* jshint ignore:end */
function MetricsPage(version, response, sid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    sid: sid
  };
}

_.extend(MetricsPage.prototype, Page.prototype);
MetricsPage.prototype.constructor = MetricsPage;

/* jshint ignore:start */
/**
 * Build an instance of MetricsInstance
 *
 * @function getInstance
 * @memberof Twilio.Preview.Insights.CallContext.MetricsPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns MetricsInstance
 */
/* jshint ignore:end */
MetricsPage.prototype.getInstance = function getInstance(payload) {
  return new MetricsInstance(
    this._version,
    payload,
    this._solution.sid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.MetricsList
 * @description Initialize the MetricsList
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {string} sid - The sid
 */
/* jshint ignore:end */
function MetricsList(version, sid) {
  /* jshint ignore:start */
  /**
   * @function metrics
   * @memberof Twilio.Preview.Insights.CallContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Preview.Insights.CallContext.MetricsContext}
   */
  /* jshint ignore:end */
  function MetricsListInstance(sid) {
    return MetricsListInstance.get(sid);
  }

  MetricsListInstance._version = version;
  // Path Solution
  MetricsListInstance._solution = {
    sid: sid
  };
  MetricsListInstance._uri = _.template(
    '/Calls/<%= callSid %>/Metrics' // jshint ignore:line
  )(MetricsListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams MetricsInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Preview.Insights.CallContext.MetricsList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.callSid - The call_sid
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
  MetricsListInstance.each = function each(opts, callback) {
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
   * @description Lists MetricsInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Preview.Insights.CallContext.MetricsList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.callSid - The call_sid
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
  MetricsListInstance.list = function list(opts, callback) {
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
   * Retrieve a single page of MetricsInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Preview.Insights.CallContext.MetricsList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.callSid - The call_sid
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  MetricsListInstance.page = function page(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.callSid)) {
      throw new Error('Required parameter "opts.callSid" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'CallSid': opts.callSid,
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
      deferred.resolve(new MetricsPage(
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

  return MetricsListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Insights.CallContext.MetricsInstance
 * @description Initialize the MetricsContext
 *
 * @property {string} callSid - The call_sid
 * @property {number} totalBytesReceived - The total_bytes_received
 * @property {number} totalPacketsReceived - The total_packets_received
 * @property {number} totalBytesSent - The total_bytes_sent
 * @property {string} mos - The mos
 * @property {Date} timestamp - The timestamp
 * @property {number} totalPacketsSent - The total_packets_sent
 * @property {number} audioLevelIn - The audio_level_in
 * @property {number} audioLevelOut - The audio_level_out
 * @property {number} packetsReceived - The packets_received
 * @property {number} jitter - The jitter
 * @property {string} timestampMs - The timestamp_ms
 * @property {number} rtt - The rtt
 * @property {number} packetsLost - The packets_lost
 * @property {number} totalPacketsLost - The total_packets_lost
 * @property {string} packetsLostFraction - The packets_lost_fraction
 *
 * @param {Twilio.Preview.Insights} version - Version of the resource
 * @param {object} payload - The instance payload
 */
/* jshint ignore:end */
function MetricsInstance(version, payload, sid) {
  this._version = version;

  // Marshaled Properties
  this.callSid = payload.call_sid; // jshint ignore:line
  this.totalBytesReceived = deserialize.integer(payload.total_bytes_received); // jshint ignore:line
  this.totalPacketsReceived = deserialize.integer(payload.total_packets_received); // jshint ignore:line
  this.totalBytesSent = deserialize.integer(payload.total_bytes_sent); // jshint ignore:line
  this.mos = payload.mos; // jshint ignore:line
  this.timestamp = deserialize.iso8601DateTime(payload.timestamp); // jshint ignore:line
  this.totalPacketsSent = deserialize.integer(payload.total_packets_sent); // jshint ignore:line
  this.audioLevelIn = deserialize.integer(payload.audio_level_in); // jshint ignore:line
  this.audioLevelOut = deserialize.integer(payload.audio_level_out); // jshint ignore:line
  this.packetsReceived = deserialize.integer(payload.packets_received); // jshint ignore:line
  this.jitter = deserialize.integer(payload.jitter); // jshint ignore:line
  this.timestampMs = payload.timestamp_ms; // jshint ignore:line
  this.rtt = deserialize.integer(payload.rtt); // jshint ignore:line
  this.packetsLost = deserialize.integer(payload.packets_lost); // jshint ignore:line
  this.totalPacketsLost = deserialize.integer(payload.total_packets_lost); // jshint ignore:line
  this.packetsLostFraction = payload.packets_lost_fraction; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    sid: sid,
  };
}

module.exports = {
  MetricsPage: MetricsPage,
  MetricsList: MetricsList,
  MetricsInstance: MetricsInstance,
  MetricsContext: MetricsContext
};
