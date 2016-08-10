'use strict';
var index_1 = require('../../../../../index');
var chai_1 = require('chai');
var log = console.log;
describe('SyncMapItem', function () {
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
    function printSyncMapItem(item) {
        log('SyncMapItem: ');
        index_1.prettyPrint({
            key: item.key,
            accountSid: item.accountSid,
            serviceSid: item.serviceSid,
            mapSid: item.mapSid,
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
        var syncMap;
        var syncMapItem;
        before('Create', function (done) {
            log('Creating SyncMapItem');
            serviceInstance.syncMaps().create()
                .then(function (map) {
                syncMap = map;
                return syncMap.syncMapItems().create({ key: 'CRUD_key', data: JSON.stringify({ "da": "ta" }) });
            })
                .then(function (item) {
                syncMapItem = item;
                chai_1.assert.equal(syncMapItem.key, 'CRUD_key');
                chai_1.assert.deepEqual(syncMapItem.data, { "da": "ta" });
            })
                .then(function () { return done(); })
                .catch(done);
        });
        it('Refresh', function (done) {
            log('Refresh SyncMapItem');
            return syncMapItem.fetch()
                .then(function (item) {
                log('Refreshed SyncMapItem:');
                printSyncMapItem(item);
                return item;
            })
                .then(function () { return done(); })
                .catch(done);
        });
        it('Fetch by key', function (done) {
            log("Fetching SyncMapItem " + syncMapItem.key);
            syncMap.syncMapItems().get(syncMapItem.key).fetch()
                .then(function (fetchedItem) {
                chai_1.assert.deepEqual(fetchedItem.data, syncMapItem.data);
                done();
            })
                .catch(done);
        });
        it('Update', function (done) {
            log('Updating SyncMapItem');
            var updateOpts = {
                data: JSON.stringify({ "500": "miles" })
            };
            syncMapItem.update(updateOpts)
                .then(function (item) {
                chai_1.assert.deepEqual(item.data, { "500": "miles" });
                done();
            })
                .catch(done);
        });
        after('Remove', function (done) {
            syncMapItem.remove()
                .then(function (success) {
                log("Removed SyncMapItem, success=" + success);
                chai_1.assert.equal(success, true);
                done();
            })
                .catch(done);
        });
    });
    describe('Query', function () {
        var syncMap;
        before('Create SyncMap with SyncMapItems', function (done) {
            serviceInstance.syncMaps().create()
                .then(function (map) {
                syncMap = map;
                return syncMap.syncMapItems().list();
            })
                .then(function (result) {
                log("Received SyncMapItem list with size " + result.length);
                chai_1.assert.equal(result.length, 0);
            })
                .then(function () {
                log('Creating 10 SyncMapItems');
                var promises = [];
                for (var i = 0; i < 10; i++) {
                    var data = {
                        loopy: i,
                        my: 'pony',
                        is: ['the', { best: 'pony' }, 1, ""]
                    };
                    var createOpts = {
                        key: "key" + i,
                        data: JSON.stringify(data)
                    };
                    promises.push(syncMap.syncMapItems().create(createOpts));
                }
                return Promise.all(promises)
                    .then(function (result) {
                    log('Created 10 SyncMapItems:');
                    result.forEach(printSyncMapItem);
                });
            })
                .then(function () { return done(); })
                .catch(done);
        });
        it('pageSize=3, limit=8', function (done) {
            log('Querying SyncMapItems with (pageSize=3, limit=8)');
            syncMap.syncMapItems().list({ pageSize: 3, limit: 8 })
                .then(function (result) {
                var keys = result.map(function (i) { return i.key; });
                log("Received SyncMapItems " + keys);
                chai_1.assert.deepEqual(keys, ['key0', 'key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7']);
                result.forEach(printSyncMapItem);
                done();
            })
                .catch(done);
        });
        it('from=key4, pageSize=2, bounds=exclusive', function (done) {
            log('Querying SyncMapItems with (from=key4, pageSize=2, bounds=exclusive)');
            syncMap.syncMapItems().list({ from: 'key4', pageSize: 2, bounds: 'exclusive' })
                .then(function (result) {
                var keys = result.map(function (i) { return i.key; });
                log("Received SyncMapItems " + keys);
                chai_1.assert.deepEqual(keys, ['key5', 'key6', 'key7', 'key8', 'key9']);
                done();
            })
                .catch(done);
        });
        it('from=key4, direction=backwards, pageSize=2', function (done) {
            log('Querying SyncMapItems with (from=key4, order=desc, pageSize=2)');
            syncMap.syncMapItems().list({ from: 'key4', order: 'desc', pageSize: 2 })
                .then(function (result) {
                var keys = result.map(function (i) { return i.key; });
                log("Received SyncMapItems " + keys);
                chai_1.assert.deepEqual(keys, ['key4', 'key3', 'key2', 'key1', 'key0']);
                done();
            })
                .catch(done);
        });
        it('each, from=key2, pageSize=3, limit=4', function (done) {
            log('Iterating over SyncMapItems with (from=key2, pageSize=3, limit=4)');
            var processedKeys = [];
            var itemHandler = function (item) {
                processedKeys.push(item.key);
            };
            var eachOpts = {
                from: 'key2',
                pageSize: 3,
                limit: 4,
                done: function () {
                    log("Received SyncMapItems " + processedKeys);
                    chai_1.assert.deepEqual(processedKeys, ['key2', 'key3', 'key4', 'key5']);
                    done();
                }
            };
            syncMap.syncMapItems().each(eachOpts, itemHandler);
        });
    });
});
