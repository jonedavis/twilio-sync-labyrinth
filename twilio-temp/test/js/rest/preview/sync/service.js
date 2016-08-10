'use strict';
var index_1 = require('../../../index');
var chai_1 = require('chai');
var log = console.log;
describe('Service', function () {
    function printServiceInstance(si) {
        log('Service Instance:');
        index_1.prettyPrint({
            sid: si.sid,
            accountSid: si.accountSid,
            friendlyName: si.friendlyName,
            dateCreated: si.dateCreated,
            dateUpdated: si.dateUpdated,
            url: si.url,
            webhookUrl: si.webhookUrl,
        });
        log();
    }
    it('Should list Service Instances', function (done) {
        var listOpts = {
            pageSize: 3,
            limit: 8
        };
        log('Listing 8 Services in groups of 3');
        index_1.Sync.services.list(listOpts)
            .then(function (result) {
            log("Received Service list with size " + result.length);
            chai_1.assert.equal(result.length, 8);
            result.forEach(printServiceInstance);
            done();
        })
            .catch(done);
    });
    it('Should iterate over Service Instances', function (done) {
        var instancesProcessed = 0;
        var eachOpts = {
            pageSize: 3,
            limit: 8,
            done: function () {
                log('Service Instances Iteration done');
                chai_1.assert.equal(instancesProcessed, 8);
                done();
            }
        };
        var serviceHandler = function (si) {
            log('Received Service Instance:');
            instancesProcessed++;
            printServiceInstance(si);
        };
        log('Iterating over 8 Services in groups of 3');
        index_1.Sync.services.each(eachOpts, serviceHandler);
    });
    it('Should CRUD Service Instance', function (done) {
        log('Creating Service Instance');
        var createOpts = {
            friendlyName: 'sync_node_sdk_test_1'
        };
        index_1.Sync.services.create(createOpts)
            .then(function (si) {
            log('Created Service Instance');
            printServiceInstance(si);
            return si;
        })
            .then(function (si) {
            log('Updating Service Instance webhookUrl');
            var updateRequest = {
                webhookUrl: 'http://www.lroesntuahos75748etoqbxetuhcygl.com'
            };
            return si.update(updateRequest)
                .then(function (si) {
                log('Updated Service Instance');
                printServiceInstance(si);
                return si;
            });
        })
            .then(function (instance) {
            log('Fetching Service Instance');
            return instance.fetch()
                .then(function (si) {
                log('Fetched Service Instance');
                printServiceInstance(si);
                return instance;
            });
        })
            .then(function (si) {
            log('Removing Service Instance');
            return si.remove()
                .then(function (success) {
                log('Removed Service Instance');
                done();
            });
        })
            .catch(done);
    });
});
