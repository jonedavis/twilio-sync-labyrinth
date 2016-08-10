'use strict';
import {prettyPrint, Sync, createInstance, removeInstance} from '../../../../index';
const log = console.log;
import {assert} from 'chai';

describe('SyncMap', () => {
    let serviceInstance: Service.Instance;
    before((done: any) => {
        createInstance()
            .then((si: Service.Instance) => {
                serviceInstance = si;
                done()
            })
            .catch(done);
    });
    after((done: any) => {
        removeInstance(serviceInstance)
            .then(() => done())
            .catch(done); 
    });

    function printSyncMap(map: SyncMap.Instance) {
        log('SyncMap: ');
        prettyPrint({
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

    it('Should list SyncMaps', (done: any) => {
        log('Listing SyncMaps');
        serviceInstance.syncMaps().list()
            .then((result: SyncMap.Instance[]) => {
                log(`Received SyncMap list with size ${result.length}`);
                assert.equal(result.length, 0);
            })
            .then(() => {
                log('Creating 10 SyncMaps');
                const promises: Promise<SyncMap.Instance>[] = [];
                for (let i = 0; i < 10; i++) {
                    promises.push(serviceInstance.syncMaps().create());
                }
                return Promise.all(promises)
                    .then((responses: SyncMap.Instance[]) => {
                        log('Created 10 SyncMaps:');
                    })
            })
            .then(() => {
                log('Querying 8 SyncMaps with pageSize=3');
                return serviceInstance.syncMaps().list({pageSize: 3, limit: 8})
                    .then((result: SyncMap.Instance[]) => {
                        log(`Received SyncMap list with size ${result.length}`);
                        assert.equal(result.length, 8);
                        result.forEach(printSyncMap);
                    });
            })
            .then(() => {
                log('Iterating over 8 SyncMaps with pageSize=3');
                let mapsProcessed = 0;
                const eachOpts: SyncMap.EachOpts = {
                    pageSize: 3,
                    limit: 8,
                    done: () => {
                        log('SyncMap Iteration done');
                        assert.equal(mapsProcessed, 8);
                        done();
                    }    
                };
                const mapHandler = (map: SyncMap.Instance) => {
                    log('Received SyncMap:');
                    printSyncMap(map);
                    mapsProcessed++;        
                }; 
                serviceInstance.syncMaps().each(eachOpts, mapHandler);
            }) 
            .catch(done);
        }
    );

    it('Should CRUD SyncMap', (done: any) => {
        const createOpts: SyncMap.CreateOpts = {
            uniqueName: 'sync_node_sdk_test_SyncMap'
        };
        log('Creating SyncMap');
        serviceInstance.syncMaps().create(createOpts)
            .then((map: SyncMap.Instance) => {
                log('Created SyncMap');
                printSyncMap(map);
                return map;
            })
            .then((map: SyncMap.Instance) => {
                log('Fetching SyncMap');
                return map.fetch()
                    .then((map: SyncMap.Instance) => {
                        log('Fetched SyncMap:');
                        printSyncMap(map);
                        return map;
                    });
            })
            .then((map: SyncMap.Instance) => {
                log('Removing SyncMap');
                return map.remove()
                    .then((success: boolean) => {
                        log(`Removed SyncMap, success=${success}`);
                    });
            })
            .then(() => done())
            .catch(done);
        }
    );
});
