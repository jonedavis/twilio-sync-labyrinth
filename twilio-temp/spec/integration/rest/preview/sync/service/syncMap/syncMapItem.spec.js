'use strict';

var _ = require('lodash');
var Holodeck = require('../../../../../holodeck');
var Request = require('../../../../../../../lib/http/request');
var Response = require('../../../../../../../lib/http/response');
var Twilio = require('../../../../../../../lib');


var client;
var holodeck;

describe('SyncMapItem', function() {
  beforeEach(function() {
    holodeck = new Holodeck();
    client = new Twilio('ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'AUTHTOKEN', holodeck);
  });
  it('should generate valid fetch request',
    function() {
      holodeck.mock(new Response(500, ''));

      var promise = client.preview.Sync.services('ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                                       .syncMaps('sid')
                                       .syncMapItems('key').fetch();
      promise = promise.then(function() {
        throw new Error('failed');
      }, function(error) {
        expect(error.constructor).toBe(Error.prototype.constructor);
      });
      promise.done();

      var solution = {
        serviceSid: 'ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        mapSid: 'mapSid',
        key: 'key'
      };
      var url = _.template('https://preview.twilio.com/Sync/Services/<%= serviceSid %>/Maps/<%= mapSid %>/Items/<%= key %>')(solution);

      holodeck.assertHasRequest(new Request({
        method: 'GET',
        url: url
      }));
    }
  );
  it('should generate valid remove request',
    function() {
      holodeck.mock(new Response(500, ''));

      var promise = client.preview.Sync.services('ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                                       .syncMaps('sid')
                                       .syncMapItems('key').remove();
      promise = promise.then(function() {
        throw new Error('failed');
      }, function(error) {
        expect(error.constructor).toBe(Error.prototype.constructor);
      });
      promise.done();

      var solution = {
        serviceSid: 'ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        mapSid: 'mapSid',
        key: 'key'
      };
      var url = _.template('https://preview.twilio.com/Sync/Services/<%= serviceSid %>/Maps/<%= mapSid %>/Items/<%= key %>')(solution);

      holodeck.assertHasRequest(new Request({
        method: 'DELETE',
        url: url
      }));
    }
  );
  it('should generate valid create request',
    function() {
      holodeck.mock(new Response(500, ''));

      var opts = {
        key: 'key',
        data: '{}'
      };
      var promise = client.preview.Sync.services('ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                                       .syncMaps('sid')
                                       .syncMapItems.create(opts);
      promise = promise.then(function() {
        throw new Error('failed');
      }, function(error) {
        expect(error.constructor).toBe(Error.prototype.constructor);
      });
      promise.done();

      var solution = {
        serviceSid: 'ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        mapSid: 'MPaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      };
      var url = _.template('https://preview.twilio.com/Sync/Services/<%= serviceSid %>/Maps/<%= mapSid %>/Items')(solution);

      var values = {
        Key: 'key',
        Data: '{}',
      };
      holodeck.assertHasRequest(new Request({
          method: 'POST',
          url: url,
          data: values
      }));
    }
  );
  it('should generate valid list request',
    function() {
      holodeck.mock(new Response(500, ''));

      var promise = client.preview.Sync.services('ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                                       .syncMaps('sid')
                                       .syncMapItems.list();
      promise = promise.then(function() {
        throw new Error('failed');
      }, function(error) {
        expect(error.constructor).toBe(Error.prototype.constructor);
      });
      promise.done();

      var solution = {
        serviceSid: 'ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        mapSid: 'MPaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      };
      var url = _.template('https://preview.twilio.com/Sync/Services/<%= serviceSid %>/Maps/<%= mapSid %>/Items')(solution);

      holodeck.assertHasRequest(new Request({
        method: 'GET',
        url: url
      }));
    }
  );
  it('should generate valid update request',
    function() {
      holodeck.mock(new Response(500, ''));

      var opts = {
        data: '{}'
      };
      var promise = client.preview.Sync.services('ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                                       .syncMaps('sid')
                                       .syncMapItems('key').update(opts);
      promise = promise.then(function() {
        throw new Error('failed');
      }, function(error) {
        expect(error.constructor).toBe(Error.prototype.constructor);
      });
      promise.done();

      var solution = {
        serviceSid: 'ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        mapSid: 'mapSid',
        key: 'key'
      };
      var url = _.template('https://preview.twilio.com/Sync/Services/<%= serviceSid %>/Maps/<%= mapSid %>/Items/<%= key %>')(solution);

      var values = {
        Data: '{}',
      };
      holodeck.assertHasRequest(new Request({
          method: 'POST',
          url: url,
          data: values
      }));
    }
  );
});

