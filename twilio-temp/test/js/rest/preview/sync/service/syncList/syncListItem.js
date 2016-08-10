'use strict';
var index_1 = require('../../../../../index');
var chai_1 = require('chai');
var log = console.log;
describe('SyncListItem', function () {
    var serviceInstance;
    before('Create Service Instance', function (done) {
        index_1.createInstance()
            .then(function (si) {
            serviceInstance = si;
            done();
        })
            .catch(done);
    });
    after('Remove Service Instance', function (done) {
        index_1.removeInstance(serviceInstance)
            .then(function () { return done(); })
            .catch(done);
    });
    function printSyncListItem(item) {
        log('SyncListItem: ');
        index_1.prettyPrint({
            index: item.index,
            accountSid: item.accountSid,
            serviceSid: item.serviceSid,
            listSid: item.listSid,
            url: item.url,
            revision: item.revision,
            data: item.data,
            dateCreated: item.dateCreated,
            dateUpdated: item.dateUpdated,
            createdBy: item.createdBy
        });
        log();
    }
    describe('CRUD', function () {
        var syncList;
        var syncListItem;
        before('Create', function (done) {
            log('Creating SyncListItem');
            serviceInstance.syncLists().create()
                .then(function (list) {
                syncList = list;
                return syncList.syncListItems().create({ data: JSON.stringify({ "da": "ta" }) });
            })
                .then(function (item) {
                syncListItem = item;
                chai_1.assert.deepEqual(syncListItem.data, { "da": "ta" });
            })
                .then(function () { return done(); })
                .catch(done);
        });
        it('Refresh', function (done) {
            log('Refresh SyncListItem');
            return syncListItem.fetch()
                .then(function (item) {
                log('Refreshed SyncListItem:');
                printSyncListItem(item);
                return item;
            })
                .then(function () { return done(); })
                .catch(done);
        });
        it('Fetch by index', function (done) {
            log("Fetching SyncListItem " + syncListItem.index);
            syncList.syncListItems().get(syncListItem.index).fetch()
                .then(function (fetchedItem) {
                chai_1.assert.deepEqual(fetchedItem.data, syncListItem.data);
                done();
            })
                .catch(done);
        });
        it('Update', function (done) {
            log('Updating SyncListItem');
            var updateOpts = {
                data: JSON.stringify({ "500": "miles" })
            };
            syncListItem.update(updateOpts)
                .then(function (item) {
                chai_1.assert.deepEqual(item.data, { "500": "miles" });
                done();
            })
                .catch(done);
        });
        after('Remove', function (done) {
            syncListItem.remove()
                .then(function (success) {
                log("Removed SyncListItem, success=" + success);
                chai_1.assert.equal(success, true);
                done();
            })
                .catch(done);
        });
    });
    describe('Query', function () {
        var syncList;
        before('Create SyncList with SyncListItems', function (done) {
            serviceInstance.syncLists().create()
                .then(function (list) {
                syncList = list;
                return syncList.syncListItems().list();
            })
                .then(function (result) {
                log("Received SyncListItem list with size " + result.length);
                chai_1.assert.equal(result.length, 0);
            })
                .then(function () {
                log('Creating 10 SyncListsItems');
                var promises = [];
                for (var i = 0; i < 10; i++) {
                    var data = {
                        loopy: i,
                        my: 'pony',
                        is: ['the', { best: 'pony' }, 1, ""]
                    };
                    var createOpts = {
                        data: JSON.stringify(data)
                    };
                    promises.push(syncList.syncListItems().create(createOpts));
                }
                return Promise.all(promises)
                    .then(function (result) {
                    log('Created 10 SyncListItems:');
                    result.forEach(printSyncListItem);
                });
            })
                .then(function () { return done(); })
                .catch(done);
        });
        it('pageSize=3, limit=8', function (done) {
            log('Querying SyncListItems with (pageSize=3, limit=8)');
            syncList.syncListItems().list({ pageSize: 3, limit: 8 })
                .then(function (result) {
                var indices = result.map(function (i) { return i.index; });
                log("Received SyncListItems " + indices);
                chai_1.assert.deepEqual(indices, [0, 1, 2, 3, 4, 5, 6, 7]);
                result.forEach(printSyncListItem);
                done();
            })
                .catch(done);
        });
        it('from=4, pageSize=2, bounds=exclusive', function (done) {
            log('Querying SyncListItems with (from=4, pageSize=2, bounds=exclusive)');
            syncList.syncListItems().list({ from: 4, pageSize: 2, bounds: 'exclusive' })
                .then(function (result) {
                var indices = result.map(function (i) { return i.index; });
                log("Received SyncListItems " + indices);
                chai_1.assert.deepEqual(indices, [5, 6, 7, 8, 9]);
                done();
            })
                .catch(done);
        });
        it('from=4, direction=backwards, pageSize=2', function (done) {
            log('Querying SyncListItems with (from=4, order=desc, pageSize=2)');
            syncList.syncListItems().list({ from: 4, order: 'desc', pageSize: 2 })
                .then(function (result) {
                var indices = result.map(function (i) { return i.index; });
                log("Received SyncListItems " + indices);
                chai_1.assert.deepEqual(indices, [4, 3, 2, 1, 0]);
                done();
            })
                .catch(done);
        });
        it('each, from=2, pageSize=3, limit=4', function (done) {
            log('Iterating over SyncListItems with (from=2, pageSize=3, limit=4)');
            var processedIndices = [];
            var itemHandler = function (item) {
                processedIndices.push(item.index);
            };
            var eachOpts = {
                from: 2,
                pageSize: 3,
                limit: 4,
                done: function () {
                    log("Received SyncListItems " + processedIndices);
                    chai_1.assert.deepEqual(processedIndices, [2, 3, 4, 5]);
                    done();
                }
            };
            syncList.syncListItems().each(eachOpts, itemHandler);
        });
    });
});
