'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var DocumentPage;
var DocumentList;
var DocumentInstance;
var DocumentContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Sync.ServiceContext.DocumentPage
 * @augments Page
 * @description Initialize the DocumentPage
 *
 * @param {Twilio.Preview.Sync} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} serviceSid - The service_sid
 *
 * @returns DocumentPage
 */
/* jshint ignore:end */
function DocumentPage(version, response, serviceSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    serviceSid: serviceSid
  };
}

_.extend(DocumentPage.prototype, Page.prototype);
DocumentPage.prototype.constructor = DocumentPage;

/* jshint ignore:start */
/**
 * Build an instance of DocumentInstance
 *
 * @function getInstance
 * @memberof Twilio.Preview.Sync.ServiceContext.DocumentPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns DocumentInstance
 */
/* jshint ignore:end */
DocumentPage.prototype.getInstance = function getInstance(payload) {
  return new DocumentInstance(
    this._version,
    payload,
    this._solution.serviceSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Sync.ServiceContext.DocumentList
 * @description Initialize the DocumentList
 *
 * @param {Twilio.Preview.Sync} version - Version of the resource
 * @param {string} serviceSid - The service_sid
 */
/* jshint ignore:end */
function DocumentList(version, serviceSid) {
  /* jshint ignore:start */
  /**
   * @function documents
   * @memberof Twilio.Preview.Sync.ServiceContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Preview.Sync.ServiceContext.DocumentContext}
   */
  /* jshint ignore:end */
  function DocumentListInstance(sid) {
    return DocumentListInstance.get(sid);
  }

  DocumentListInstance._version = version;
  // Path Solution
  DocumentListInstance._solution = {
    serviceSid: serviceSid
  };
  DocumentListInstance._uri = _.template(
    '/Services/<%= serviceSid %>/Documents' // jshint ignore:line
  )(DocumentListInstance._solution);
  /* jshint ignore:start */
  /**
   * create a DocumentInstance
   *
   * @function create
   * @memberof Twilio.Preview.Sync.ServiceContext.DocumentList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.uniqueName] - The unique_name
   * @param {string} [opts.data] - The data
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed DocumentInstance
   */
  /* jshint ignore:end */
  DocumentListInstance.create = function create(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'UniqueName': opts.uniqueName,
      'Data': opts.data
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new DocumentInstance(
        this._version,
        payload,
        this._solution.serviceSid,
        this._solution.sid
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

  /* jshint ignore:start */
  /**
   * Streams DocumentInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Preview.Sync.ServiceContext.DocumentList
   * @instance
   *
   * @param {object|function} opts - ...
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
  DocumentListInstance.each = function each(opts, callback) {
    opts = opts || {};
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
   * @description Lists DocumentInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Preview.Sync.ServiceContext.DocumentList
   * @instance
   *
   * @param {object|function} opts - ...
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
  DocumentListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
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
   * Retrieve a single page of DocumentInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Preview.Sync.ServiceContext.DocumentList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  DocumentListInstance.page = function page(opts, callback) {
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
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
      deferred.resolve(new DocumentPage(
        this._version,
        payload,
        this._solution.serviceSid,
        this._solution.sid
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

  /* jshint ignore:start */
  /**
   * Constructs a document
   *
   * @function get
   * @memberof Twilio.Preview.Sync.ServiceContext.DocumentList
   * @instance
   *
   * @param {string} sid - The sid
   *
   * @returns {Twilio.Preview.Sync.ServiceContext.DocumentContext}
   */
  /* jshint ignore:end */
  DocumentListInstance.get = function get(sid) {
    return new DocumentContext(
      this._version,
      this._solution.serviceSid,
      sid
    );
  };

  return DocumentListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Sync.ServiceContext.DocumentInstance
 * @description Initialize the DocumentContext
 *
 * @property {string} sid - The sid
 * @property {string} uniqueName - The unique_name
 * @property {string} accountSid - The account_sid
 * @property {string} serviceSid - The service_sid
 * @property {string} url - The url
 * @property {string} revision - The revision
 * @property {string} data - The data
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} createdBy - The created_by
 *
 * @param {Twilio.Preview.Sync} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} serviceSid - The service_sid
 * @param {string} sid - The sid
 */
/* jshint ignore:end */
function DocumentInstance(version, payload, serviceSid, sid) {
  this._version = version;

  // Marshaled Properties
  this.sid = payload.sid; // jshint ignore:line
  this.uniqueName = payload.unique_name; // jshint ignore:line
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.serviceSid = payload.service_sid; // jshint ignore:line
  this.url = payload.url; // jshint ignore:line
  this.revision = payload.revision; // jshint ignore:line
  this.data = payload.data; // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated); // jshint ignore:line
  this.createdBy = payload.created_by; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    serviceSid: serviceSid,
    sid: sid || this.sid,
  };
}

Object.defineProperty(DocumentInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new DocumentContext(
        this._version,
        this._solution.serviceSid,
        this._solution.sid
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * fetch a DocumentInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Sync.ServiceContext.DocumentInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DocumentInstance
 */
/* jshint ignore:end */
DocumentInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * remove a DocumentInstance
 *
 * @function remove
 * @memberof Twilio.Preview.Sync.ServiceContext.DocumentInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DocumentInstance
 */
/* jshint ignore:end */
DocumentInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};

/* jshint ignore:start */
/**
 * update a DocumentInstance
 *
 * @function update
 * @memberof Twilio.Preview.Sync.ServiceContext.DocumentInstance
 * @instance
 *
 * @param {object} opts - ...
 * @param {string} opts.data - The data
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DocumentInstance
 */
/* jshint ignore:end */
DocumentInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Sync.ServiceContext.DocumentContext
 * @description Initialize the DocumentContext
 *
 * @param {Twilio.Preview.Sync} version - Version of the resource
 * @param {sid} serviceSid - The service_sid
 * @param {string} sid - The sid
 */
/* jshint ignore:end */
function DocumentContext(version, serviceSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    serviceSid: serviceSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Services/<%= serviceSid %>/Documents/<%= sid %>' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * fetch a DocumentInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Sync.ServiceContext.DocumentContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DocumentInstance
 */
/* jshint ignore:end */
DocumentContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new DocumentInstance(
      this._version,
      payload,
      this._solution.serviceSid,
      this._solution.sid
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

/* jshint ignore:start */
/**
 * remove a DocumentInstance
 *
 * @function remove
 * @memberof Twilio.Preview.Sync.ServiceContext.DocumentContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DocumentInstance
 */
/* jshint ignore:end */
DocumentContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * update a DocumentInstance
 *
 * @function update
 * @memberof Twilio.Preview.Sync.ServiceContext.DocumentContext
 * @instance
 *
 * @param {object} opts - ...
 * @param {string} opts.data - The data
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed DocumentInstance
 */
/* jshint ignore:end */
DocumentContext.prototype.update = function update(opts, callback) {
  if (_.isUndefined(opts)) {
    throw new Error('Required parameter "opts" missing.');
  }
  if (_.isUndefined(opts.data)) {
    throw new Error('Required parameter "opts.data" missing.');
  }

  var deferred = Q.defer();
  var data = values.of({
    'Data': opts.data
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new DocumentInstance(
      this._version,
      payload,
      this._solution.serviceSid,
      this._solution.sid
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
  DocumentPage: DocumentPage,
  DocumentList: DocumentList,
  DocumentInstance: DocumentInstance,
  DocumentContext: DocumentContext
};
