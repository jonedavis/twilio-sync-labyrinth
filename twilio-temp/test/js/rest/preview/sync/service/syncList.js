'use strict';
var index_1 = require('../../../../index');
var chai_1 = require('chai');
var log = console.log;
describe('SyncList', function () {
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
    function printSyncList(list) {
        log('SyncList: ');
        index_1.prettyPrint({
            sid: list.sid,
            uniqueName: list.uniqueName,
            serviceSid: list.serviceSid,
            accountSid: list.accountSid,
            url: list.url,
            revision: list.revision,
            dateCreated: list.dateCreated,
            dateUpdated: list.dateUpdated,
            createdBy: list.createdBy,
            links: list.links
        });
        log();
    }
    it('Should list SyncLists', function (done) {
        log('Listing SyncLists');
        serviceInstance.syncLists().list()
            .then(function (result) {
            log("Received SyncList list with size " + result.length);
            chai_1.assert.equal(result.length, 0);
        })
            .then(function () {
            log('Creating 10 SyncLists');
            var promises = [];
            for (var i = 0; i < 10; i++) {
                promises.push(serviceInstance.syncLists().create());
            }
            return Promise.all(promises)
                .then(function (result) {
                log('Created 10 SyncLists:');
                result.forEach(printSyncList);
            });
        })
            .then(function () {
            log('Querying 8 SyncLists with pageSize=3');
            return serviceInstance.syncLists().list({ pageSize: 3, limit: 8 })
                .then(function (result) {
                log("Received SyncList list with size " + result.length);
                chai_1.assert.equal(result.length, 8);
                result.forEach(printSyncList);
            });
        })
            .then(function () {
            log('Iterating over 8 SyncLists with pageSize=3');
            var listsProcessed = 0;
            var eachOpts = {
                pageSize: 3,
                limit: 8,
                done: function () {
                    log('SyncList Iteration done');
                    chai_1.assert.equal(listsProcessed, 8);
                    done();
                }
            };
            var listHandler = function (list) {
                log('Received SyncList:');
                printSyncList(list);
                listsProcessed++;
            };
            serviceInstance.syncLists().each(eachOpts, listHandler);
        })
            .catch(done);
    });
    it('Should CRUD SyncList', function (done) {
        var createOpts = {
            uniqueName: 'sync_node_sdk_test_SyncList'
        };
        log('Creating SyncList');
        serviceInstance.syncLists().create(createOpts)
            .then(function (list) {
            log('Created SyncList');
            printSyncList(list);
            return list;
        })
            .then(function (list) {
            log('Fetching SyncList');
            return list.fetch()
                .then(function (list) {
                log('Fetched SyncList:');
                printSyncList(list);
                return list;
            });
        })
            .then(function (list) {
            log('Removing SyncList');
            return list.remove()
                .then(function (success) {
                log("Removed SyncList, success=" + success);
            });
        })
            .then(function () { return done(); })
            .catch(done);
    });
});
