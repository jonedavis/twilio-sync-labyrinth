'use strict';
import {prettyPrint, Sync, createInstance, removeInstance} from '../../../../index';
import {assert} from 'chai';
const log = console.log;

describe('SyncList', () => {
    let serviceInstance: Service.Instance;
    before((done: any) => {
        createInstance()
            .then((si: Service.Instance) => {
                serviceInstance = si;
                done()
            })
            .catch(done);
    });
    after(function(done: any) {
        removeInstance(serviceInstance)
            .then(() => done())
            .catch(done); 
    });

    function printSyncList(list: SyncList.Instance) {
        log('SyncList: ');
        prettyPrint({
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

    it('Should list SyncLists', (done: any) => {
        log('Listing SyncLists');
        serviceInstance.syncLists().list()
            .then((result: SyncList.Instance[]) => {
                log(`Received SyncList list with size ${result.length}`);
                assert.equal(result.length, 0);
            })
            .then(() => {
                log('Creating 10 SyncLists');
                const promises: Promise<SyncList.Instance>[] = [];
                for (let i = 0; i < 10; i++) {
                    promises.push(serviceInstance.syncLists().create());
                }
                return Promise.all(promises)
                    .then((result: SyncList.Instance[]) => {
                        log('Created 10 SyncLists:');
                        result.forEach(printSyncList);        
                    })
            })
            .then(() => {
                log('Querying 8 SyncLists with pageSize=3');
                return serviceInstance.syncLists().list({pageSize: 3, limit: 8})
                    .then((result: SyncList.Instance[]) => {
                        log(`Received SyncList list with size ${result.length}`);
                        assert.equal(result.length, 8);
                        result.forEach(printSyncList);
                    });
            })
            .then(() => {
                log('Iterating over 8 SyncLists with pageSize=3');
                let listsProcessed = 0;
                const eachOpts: SyncList.EachOpts = {
                    pageSize: 3,
                    limit: 8,
                    done: () => {
                        log('SyncList Iteration done');
                        assert.equal(listsProcessed, 8);
                        done();
                    }    
                };
                const listHandler = (list: SyncList.Instance) => {
                    log('Received SyncList:');
                    printSyncList(list);
                    listsProcessed++;        
                }; 
                serviceInstance.syncLists().each(eachOpts, listHandler);
            })
            .catch(done);
        }
    );

    it('Should CRUD SyncList', (done: any) => {
        const createOpts: SyncList.CreateOpts = {
            uniqueName: 'sync_node_sdk_test_SyncList'
        };
        log('Creating SyncList');
        serviceInstance.syncLists().create(createOpts)
            .then((list: SyncList.Instance) => {
                log('Created SyncList');
                printSyncList(list);
                return list;
            })
            .then((list: SyncList.Instance) => {
                log('Fetching SyncList');
                return list.fetch()
                    .then((list: SyncList.Instance) => {
                        log('Fetched SyncList:');
                        printSyncList(list);
                        return list;
                    });
            })
            .then((list: SyncList.Instance) => {
                log('Removing SyncList');
                return list.remove()
                    .then((success: boolean) => {
                        log(`Removed SyncList, success=${success}`);
                    });
            })
            .then(() => done())
            .catch(done);
        }
    ); 
});
