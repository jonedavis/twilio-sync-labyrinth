'use strict';

var _ = require('lodash');
var Holodeck = require('../../../../holodeck');
var Request = require('../../../../../../lib/http/request');
var Response = require('../../../../../../lib/http/response');
var Twilio = require('../../../../../../lib');


var client;
var holodeck;

describe('Country', function() {
  beforeEach(function() {
    holodeck = new Holodeck();
    client = new Twilio('ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'AUTHTOKEN', holodeck);
  });
  it('should generate valid list request',
    function() {
      holodeck.mock(new Response(500, ''));

      var promise = client.pricing.v1.voice
                                     .countries.list();
      promise = promise.then(function() {
        throw new Error('failed');
      }, function(error) {
        expect(error.constructor).toBe(Error.prototype.constructor);
      });
      promise.done();

      var url = 'https://pricing.twilio.com/v1/Voice/Countries';

      holodeck.assertHasRequest(new Request({
        method: 'GET',
        url: url
      }));
    }
  );
  it('should generate valid read_full response',
    function() {
      var body = JSON.stringify({
          'countries': [
              {
                  'country': 'Andorra',
                  'iso_country': 'AD',
                  'url': 'https://pricing.twilio.com/v1/Voice/Countries/AD'
              }
          ],
          'meta': {
              'first_page_url': 'https://pricing.twilio.com/v1/Voice/Countries?PageSize=1&Page=0',
              'key': 'countries',
              'next_page_url': null,
              'page': 0,
              'page_size': 1,
              'previous_page_url': null,
              'url': 'https://pricing.twilio.com/v1/Voice/Countries?PageSize=1&Page=0'
          }
      });

      holodeck.mock(new Response(200, body));

      var promise = client.pricing.v1.voice
                                     .countries.list();
      promise = promise.then(function(response) {
        expect(response).toBeDefined();
      }, function() {
        throw new Error('failed');
      });

      promise.done();
    }
  );
  it('should generate valid read_empty response',
    function() {
      var body = JSON.stringify({
          'countries': [],
          'meta': {
              'first_page_url': 'https://pricing.twilio.com/v1/Voice/Countries?PageSize=1&Page=0',
              'key': 'countries',
              'next_page_url': null,
              'page': 0,
              'page_size': 1,
              'previous_page_url': null,
              'url': 'https://pricing.twilio.com/v1/Voice/Countries?PageSize=1&Page=0'
          }
      });

      holodeck.mock(new Response(200, body));

      var promise = client.pricing.v1.voice
                                     .countries.list();
      promise = promise.then(function(response) {
        expect(response).toBeDefined();
      }, function() {
        throw new Error('failed');
      });

      promise.done();
    }
  );
  it('should generate valid fetch request',
    function() {
      holodeck.mock(new Response(500, ''));

      var promise = client.pricing.v1.voice
                                     .countries('US').fetch();
      promise = promise.then(function() {
        throw new Error('failed');
      }, function(error) {
        expect(error.constructor).toBe(Error.prototype.constructor);
      });
      promise.done();

      var solution = {
        isoCountry: 'US'
      };
      var url = _.template('https://pricing.twilio.com/v1/Voice/Countries/<%= isoCountry %>')(solution);

      holodeck.assertHasRequest(new Request({
        method: 'GET',
        url: url
      }));
    }
  );
  it('should generate valid fetch response',
    function() {
      var body = JSON.stringify({
          'country': 'Australia',
          'inbound_call_prices': [
              {
                  'base_price': '0.0075',
                  'current_price': '0.0075',
                  'number_type': 'local'
              }
          ],
          'iso_country': 'AU',
          'outbound_prefix_prices': [
              {
                  'base_price': '0.024',
                  'current_price': '0.024',
                  'friendly_name': 'Programmable Outbound Minute - Australia - Major Cities',
                  'prefixes': [
                      '6128',
                      '6129',
                      '6138',
                      '6139',
                      '6173',
                      '61261',
                      '61262',
                      '61861',
                      '61862',
                      '61863',
                      '61864',
                      '61865',
                      '61870',
                      '61881',
                      '61882',
                      '61883',
                      '61884',
                      '61892',
                      '61893',
                      '61894'
                  ]
              },
              {
                  'base_price': '0.035',
                  'current_price': '0.035',
                  'friendly_name': 'Programmable Outbound Minute - Australia',
                  'prefixes': [
                      '61'
                  ]
              },
              {
                  'base_price': '0.095',
                  'current_price': '0.095',
                  'friendly_name': 'Programmable Outbound Minute - Australia - Shared Cost Service',
                  'prefixes': [
                      '6113'
                  ]
              },
              {
                  'base_price': '0.095',
                  'current_price': '0.095',
                  'friendly_name': 'Programmable Outbound Minute - Australia - Mobile',
                  'prefixes': [
                      '614',
                      '6116',
                      '61400',
                      '61401',
                      '61402',
                      '61403',
                      '61404',
                      '61405',
                      '61406',
                      '61407',
                      '61408',
                      '61409',
                      '61410',
                      '61411',
                      '61412',
                      '61413',
                      '61414',
                      '61415',
                      '61416',
                      '61417',
                      '61418',
                      '61419',
                      '61421',
                      '61422',
                      '61423',
                      '61424',
                      '61425',
                      '61426',
                      '61427',
                      '61428',
                      '61429',
                      '61430',
                      '61431',
                      '61432',
                      '61433',
                      '61434',
                      '61435',
                      '61437',
                      '61438',
                      '61439',
                      '61447',
                      '61448',
                      '61449',
                      '61450',
                      '61451',
                      '61452',
                      '61453',
                      '61455',
                      '61456',
                      '61457',
                      '61458',
                      '61459',
                      '61466',
                      '61467',
                      '61474',
                      '61477',
                      '61478',
                      '61481',
                      '61482',
                      '61487',
                      '61490',
                      '61497',
                      '61498',
                      '61499',
                      '614202',
                      '614203',
                      '614204',
                      '614205',
                      '614206',
                      '614207',
                      '614208',
                      '614209',
                      '614444',
                      '614683',
                      '614684',
                      '614685',
                      '614686',
                      '614687',
                      '614688',
                      '614689',
                      '614790',
                      '614791',
                      '614880',
                      '614881',
                      '614882',
                      '614883',
                      '614884',
                      '614885',
                      '614886',
                      '614887',
                      '614889'
                  ]
              }
          ],
          'price_unit': 'USD',
          'url': 'https://pricing.twilio.com/v1/Voice/Countries/US'
      });

      holodeck.mock(new Response(200, body));

      var promise = client.pricing.v1.voice
                                     .countries('US').fetch();
      promise = promise.then(function(response) {
        expect(response).toBeDefined();
      }, function() {
        throw new Error('failed');
      });

      promise.done();
    }
  );
});

