'use strict';
import {prettyPrint, Sync, createInstance, removeInstance} from '../../../../../index';
import {assert} from 'chai';
const log = console.log;

describe('SyncListItem', () => {
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

    function printSyncListItem(item: SyncListItem.Instance) {
        log('SyncListItem: ');
        prettyPrint({
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

    describe('CRUD', () => {
        let syncList: SyncList.Instance;
        let syncListItem: SyncListItem.Instance;

        before('Create', (done: any) => {
            log('Creating SyncListItem');
            serviceInstance.syncLists().create()
                .then((list: SyncList.Instance) => {
                    syncList = list;
                    return syncList.syncListItems().create({data: JSON.stringify({"da": "ta"})})
                })
                .then((item: SyncListItem.Instance) => {
                    syncListItem = item;
                    assert.deepEqual(syncListItem.data, { "da": "ta" });
                })
                .then(() => done())
                .catch(done);
        });

        it('Refresh', (done: any) => {
            log('Refresh SyncListItem');
            return syncListItem.fetch()
                .then((item: SyncListItem.Instance) => {
                    log('Refreshed SyncListItem:');
                    printSyncListItem(item);
                    return item;
                })
                .then(() => done())
                .catch(done);
        });

        it('Fetch by index', (done: any) => {
            log(`Fetching SyncListItem ${syncListItem.index}`);
            syncList.syncListItems().get(syncListItem.index).fetch()
                .then((fetchedItem: SyncListItem.Instance) => {
                    assert.deepEqual(fetchedItem.data, syncListItem.data)
                    done();
            })
            .catch(done);
        });

        it('Update', (done: any) => {
            log('Updating SyncListItem');
            const updateOpts: SyncListItem.UpdateOpts = {
                data: JSON.stringify({ "500": "miles" })
            };
            syncListItem.update(updateOpts)
                .then((item: SyncListItem.Instance) => {
                    assert.deepEqual(item.data, { "500": "miles" });
                    done();
                })
                .catch(done);
        });

         after('Remove', (done: any) => {
            syncListItem.remove()
                .then((success: boolean) => {
                    log(`Removed SyncListItem, success=${success}`);
                    assert.equal(success, true);
                    done();
                })
                .catch(done);
        });
    }); 

    describe('Query', () => {
        let syncList: SyncList.Instance;
        before('Create SyncList with SyncListItems', (done: any) => {
            serviceInstance.syncLists().create()
                .then((list: SyncList.Instance) => {
                    syncList = list;
                    return syncList.syncListItems().list()
                })
                .then((result: SyncListItem.Instance[]) => {
                    log(`Received SyncListItem list with size ${result.length}`);
                    assert.equal(result.length, 0);
                }) 
                .then(() => {
                    log('Creating 10 SyncListsItems');
                    const promises: Promise<SyncListItem.Instance>[] = [];
                    for (let i = 0; i < 10; i++) {
                        const data = {
                            loopy: i,
                            my: 'pony',
                            is: ['the', { best: 'pony' }, 1, ""]
                        };
                        const createOpts: SyncListItem.CreateOpts = {
                            data: JSON.stringify(data)
                        };
                        promises.push(syncList.syncListItems().create(createOpts));
                    }
                    return Promise.all(promises)
                        .then((result: SyncListItem.Instance[]) => {
                            log('Created 10 SyncListItems:');
                            result.forEach(printSyncListItem);
                        })
                })
                .then(() => done())
                .catch(done);
        });

        it('pageSize=3, limit=8', (done: any) => {
            log('Querying SyncListItems with (pageSize=3, limit=8)');
            syncList.syncListItems().list({pageSize: 3, limit: 8})
                .then((result: SyncListItem.Instance[]) => {
                    const indices = result.map(i => i.index);
                    log(`Received SyncListItems ${indices}`);
                    assert.deepEqual(indices, [0,1,2,3,4,5,6,7]);
                    result.forEach(printSyncListItem);
                    done();
                })
                .catch(done);
        });

        it('from=4, pageSize=2, bounds=exclusive', (done: any) => {
            log('Querying SyncListItems with (from=4, pageSize=2, bounds=exclusive)');
            syncList.syncListItems().list({from: 4, pageSize: 2, bounds: 'exclusive'})
                .then((result: SyncListItem.Instance[]) => {
                    const indices = result.map(i => i.index);
                    log(`Received SyncListItems ${indices}`);
                    assert.deepEqual(indices, [5,6,7,8,9]);
                    done();
                })
                .catch(done);
        });  

        it('from=4, direction=backwards, pageSize=2', (done: any) => {
            log('Querying SyncListItems with (from=4, order=desc, pageSize=2)');
            syncList.syncListItems().list({from: 4, order: 'desc', pageSize: 2})
                .then((result: SyncListItem.Instance[]) => {
                    const indices = result.map(i => i.index);
                    log(`Received SyncListItems ${indices}`);
                    assert.deepEqual(indices, [4,3,2,1,0]);
                    done();
                })
                .catch(done);
        });

        it('each, from=2, pageSize=3, limit=4', (done: any) => {
            log('Iterating over SyncListItems with (from=2, pageSize=3, limit=4)');
            const processedIndices: number[] = []; 
            const itemHandler = (item: SyncListItem.Instance) => {
                processedIndices.push(item.index);
            };
            const eachOpts: SyncListItem.EachOpts = {
                from: 2, 
                pageSize: 3, 
                limit: 4,
                done: () => {
                    log(`Received SyncListItems ${processedIndices}`);
                    assert.deepEqual(processedIndices, [2,3,4,5]);
                    done();
                }
            }
            syncList.syncListItems().each(eachOpts, itemHandler);
        });  
    });
});
