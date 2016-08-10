'use strict';
import {prettyPrint, Sync, createInstance, removeInstance} from '../../../index';
import {assert} from 'chai';
const log = console.log;

describe('Service', () => {
    function printServiceInstance(si: Service.Instance) {
        log('Service Instance:');
        prettyPrint({
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

    it('Should list Service Instances', (done: any) => {
        const listOpts: Service.ListOpts = {
            pageSize: 3,
            limit: 8
        };
        log('Listing 8 Services in groups of 3');
        Sync.services.list(listOpts)
            .then((result: Service.Instance[]) => {
                log(`Received Service list with size ${result.length}`);
                assert.equal(result.length, 8);
                result.forEach(printServiceInstance);
                done();
            })
            .catch(done);
    });

    it('Should iterate over Service Instances', (done: any) => {
        let instancesProcessed = 0;
        const eachOpts: Service.EachOpts = {
            pageSize: 3,
            limit: 8,
            done: () => {
                log('Service Instances Iteration done');
                assert.equal(instancesProcessed, 8);
                done();
            }    
        };
        const serviceHandler = (si: Service.Instance) => {
            log('Received Service Instance:');
            instancesProcessed++;
            printServiceInstance(si);        
        };
        log('Iterating over 8 Services in groups of 3');
        Sync.services.each(eachOpts, serviceHandler);
    });

    it('Should CRUD Service Instance', (done: any) => {
        log('Creating Service Instance');
        const createOpts: Service.CreateOpts = {
            friendlyName: 'sync_node_sdk_test_1'
        };
        Sync.services.create(createOpts)
            .then((si: Service.Instance) => {
                log('Created Service Instance');
                printServiceInstance(si);
                return si;
            })
            .then((si: Service.Instance) => {
                log('Updating Service Instance webhookUrl');
                const updateRequest: Service.UpdateOpts = {
                    webhookUrl: 'http://www.lroesntuahos75748etoqbxetuhcygl.com'  
                };
                return si.update(updateRequest)
                    .then((si: Service.Instance) => {
                        log('Updated Service Instance');
                        printServiceInstance(si);
                        return si;
                    });
            })
            .then((instance: Service.Instance) => {
                log('Fetching Service Instance');
                return instance.fetch()
                    .then((si: Service.Instance) => {
                        log('Fetched Service Instance');
                        printServiceInstance(si);
                        return instance;
                    });
            })
            .then((si: Service.Instance) => {
                log('Removing Service Instance');
                return si.remove()
                    .then((success: boolean) => {
                        log('Removed Service Instance');
                        done();
                    });
            })
            .catch(done);
        }
    );
});
