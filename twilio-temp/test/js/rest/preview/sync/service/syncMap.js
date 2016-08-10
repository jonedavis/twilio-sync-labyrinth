'use strict';
var index_1 = require('../../../../index');
var log = console.log;
var chai_1 = require('chai');
describe('SyncMap', function () {
    var serviceInstance;
    before(function (done) {
        index_1.createInstance()
            .then(function (si) {
            serviceInstance = si;
            done();
        })
            .catch(done);
    });
    after(function (done) {
        index_1.removeInstance(serviceInstance)
            .then(function () { return done(); })
            .catch(done);
    });
    function printSyncMap(map) {
        log('SyncMap: ');
        index_1.prettyPrint({
            sid: map.sid,
            uniqueName: map.uniqueName,
            serviceSid: map.serviceSid,
            accountSid: map.accountSid,
            url: map.url,
            revision: map.revision,
            dateCreated: map.dateCreated,
            dateUpdated: map.dateUpdated,
            createdBy: map.createdBy,
            links: map.links
        });
        log();
    }
    it('Should list SyncMaps', function (done) {
        log('Listing SyncMaps');
        serviceInstance.syncMaps().list()
            .then(function (result) {
            log("Received SyncMap list with size " + result.length);
            chai_1.assert.equal(result.length, 0);
        })
            .then(function () {
            log('Creating 10 SyncMaps');
            var promises = [];
            for (var i = 0; i < 10; i++) {
                promises.push(serviceInstance.syncMaps().create());
            }
            return Promise.all(promises)
                .then(function (responses) {
                log('Created 10 SyncMaps:');
            });
        })
            .then(function () {
            log('Querying 8 SyncMaps with pageSize=3');
            return serviceInstance.syncMaps().list({ pageSize: 3, limit: 8 })
                .then(function (result) {
                log("Received SyncMap list with size " + result.length);
                chai_1.assert.equal(result.length, 8);
                result.forEach(printSyncMap);
            });
        })
            .then(function () {
            log('Iterating over 8 SyncMaps with pageSize=3');
            var mapsProcessed = 0;
            var eachOpts = {
                pageSize: 3,
                limit: 8,
                done: function () {
                    log('SyncMap Iteration done');
                    chai_1.assert.equal(mapsProcessed, 8);
                    done();
                }
            };
            var mapHandler = function (map) {
                log('Received SyncMap:');
                printSyncMap(map);
                mapsProcessed++;
            };
            serviceInstance.syncMaps().each(eachOpts, mapHandler);
        })
            .catch(done);
    });
    it('Should CRUD SyncMap', function (done) {
        var createOpts = {
            uniqueName: 'sync_node_sdk_test_SyncMap'
        };
        log('Creating SyncMap');
        serviceInstance.syncMaps().create(createOpts)
            .then(function (map) {
            log('Created SyncMap');
            printSyncMap(map);
            return map;
        })
            .then(function (map) {
            log('Fetching SyncMap');
            return map.fetch()
                .then(function (map) {
                log('Fetched SyncMap:');
                printSyncMap(map);
                return map;
            });
        })
            .then(function (map) {
            log('Removing SyncMap');
            return map.remove()
                .then(function (success) {
                log("Removed SyncMap, success=" + success);
            });
        })
            .then(function () { return done(); })
            .catch(done);
    });
});
