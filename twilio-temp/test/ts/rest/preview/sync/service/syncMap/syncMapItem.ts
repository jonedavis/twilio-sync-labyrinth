'use strict';
import {prettyPrint, Sync, createInstance, removeInstance} from '../../../../../index';
import {assert} from 'chai';
const log = console.log;

describe('SyncMapItem', () => {
    let serviceInstance: Service.Instance;
    before('Create Service Instance', (done: any) => {
        createInstance()
            .then((si: Service.Instance) => {
                serviceInstance = si;
                done();
            })
            .catch(done);
    });

    after('Remove Service Instance', (done: any) => {
        removeInstance(serviceInstance)
            .then(() => done())
            .catch(done);
    });

    function printSyncMapItem(item: SyncMapItem.Instance) {
        log('SyncMapItem: ');
        prettyPrint({
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

    describe('CRUD', () => {
        let syncMap: SyncMap.Instance;
        let syncMapItem: SyncMapItem.Instance;

        before('Create', (done: any) => {
            log('Creating SyncMapItem');
            serviceInstance.syncMaps().create()
                .then((map: SyncMap.Instance) => {
                    syncMap = map;
                    return syncMap.syncMapItems().create({key: 'CRUD_key', data: JSON.stringify({"da": "ta"})})
                })
                .then((item: SyncMapItem.Instance) => {
                    syncMapItem = item;
                    assert.equal(syncMapItem.key, 'CRUD_key');
                    assert.deepEqual(syncMapItem.data, { "da": "ta" });
                })
                .then(() => done())
                .catch(done);
        });

        it('Refresh', (done: any) => {
            log('Refresh SyncMapItem');
            return syncMapItem.fetch()
                .then((item: SyncMapItem.Instance) => {
                    log('Refreshed SyncMapItem:');
                    printSyncMapItem(item);
                    return item;
                })
                .then(() => done())
                .catch(done);
        });

        it('Fetch by key', (done: any) => {
            log(`Fetching SyncMapItem ${syncMapItem.key}`);
            syncMap.syncMapItems().get(syncMapItem.key).fetch()
                .then((fetchedItem: SyncMapItem.Instance) => {
                    assert.deepEqual(fetchedItem.data, syncMapItem.data)
                    done();
            })
            .catch(done);
        });

        it('Update', (done: any) => {
            log('Updating SyncMapItem');
            const updateOpts: SyncMapItem.UpdateOpts = {
                data: JSON.stringify({ "500": "miles" })
            };
            syncMapItem.update(updateOpts)
                .then((item: SyncMapItem.Instance) => {
                    assert.deepEqual(item.data, { "500": "miles" });
                    done();
                })
                .catch(done);
        });

         after('Remove', (done: any) => {
            syncMapItem.remove()
                .then((success: boolean) => {
                    log(`Removed SyncMapItem, success=${success}`);
                    assert.equal(success, true);
                    done();
                })
                .catch(done);
        });
    });

    describe('Query', () => {
        let syncMap: SyncMap.Instance;
        before('Create SyncMap with SyncMapItems', (done: any) => {
            serviceInstance.syncMaps().create()
                .then((map: SyncMap.Instance) => {
                    syncMap = map;
                    return syncMap.syncMapItems().list()
                })
                .then((result: SyncMapItem.Instance[]) => {
                    log(`Received SyncMapItem list with size ${result.length}`);
                    assert.equal(result.length, 0);
                }) 
                .then(() => {
                    log('Creating 10 SyncMapItems');
                    const promises: Promise<SyncMapItem.Instance>[] = [];
                    for (let i = 0; i < 10; i++) {
                        const data = {
                            loopy: i,
                            my: 'pony',
                            is: ['the', { best: 'pony' }, 1, ""]
                        };
                        const createOpts: SyncMapItem.CreateOpts = {
                            key: `key${i}`,
                            data: JSON.stringify(data)
                        };
                        promises.push(syncMap.syncMapItems().create(createOpts));
                    }
                    return Promise.all(promises)
                        .then((result: SyncMapItem.Instance[]) => {
                            log('Created 10 SyncMapItems:');
                            result.forEach(printSyncMapItem);
                        })
                })
                .then(() => done())
                .catch(done);
        });

        it('pageSize=3, limit=8', (done: any) => {
            log('Querying SyncMapItems with (pageSize=3, limit=8)');
            syncMap.syncMapItems().list({pageSize: 3, limit: 8})
                .then((result: SyncMapItem.Instance[]) => {
                    const keys = result.map(i => i.key);
                    log(`Received SyncMapItems ${keys}`);
                    assert.deepEqual(keys, ['key0', 'key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7']);
                    result.forEach(printSyncMapItem);
                    done();
                })
                .catch(done);
        });

        it('from=key4, pageSize=2, bounds=exclusive', (done: any) => {
            log('Querying SyncMapItems with (from=key4, pageSize=2, bounds=exclusive)');
            syncMap.syncMapItems().list({from: 'key4', pageSize: 2, bounds: 'exclusive'})
                .then((result: SyncMapItem.Instance[]) => {
                    const keys = result.map(i => i.key);
                    log(`Received SyncMapItems ${keys}`);
                    assert.deepEqual(keys, ['key5','key6','key7','key8','key9']);
                    done();
                })
                .catch(done);
        });  

        it('from=key4, direction=backwards, pageSize=2', (done: any) => {
            log('Querying SyncMapItems with (from=key4, order=desc, pageSize=2)');
            syncMap.syncMapItems().list({from: 'key4', order: 'desc', pageSize: 2})
                .then((result: SyncMapItem.Instance[]) => {
                    const keys = result.map(i => i.key);
                    log(`Received SyncMapItems ${keys}`);
                    assert.deepEqual(keys, ['key4','key3','key2','key1','key0']);
                    done();
                })
                .catch(done);
        });

        it('each, from=key2, pageSize=3, limit=4', (done: any) => {
            log('Iterating over SyncMapItems with (from=key2, pageSize=3, limit=4)');
            const processedKeys: string[] = []; 
            const itemHandler = (item: SyncMapItem.Instance) => {
                processedKeys.push(item.key);
            };
            const eachOpts: SyncMapItem.EachOpts = {
                from: 'key2', 
                pageSize: 3, 
                limit: 4,
                done: () => {
                    log(`Received SyncMapItems ${processedKeys}`);
                    assert.deepEqual(processedKeys, ['key2','key3','key4','key5']);
                    done();
                }
            };
            syncMap.syncMapItems().each(eachOpts, itemHandler);
        });  
    });
});

