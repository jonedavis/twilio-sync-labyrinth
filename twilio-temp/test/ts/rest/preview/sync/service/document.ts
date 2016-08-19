'use strict';
import {prettyPrint, Sync, createInstance, removeInstance} from '../../../../index';
import {assert} from 'chai';
const log = console.log;

describe('Document', () => {
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

    function printDocument(doc: Document.Instance) {
        log('Document: ');
        prettyPrint({
            sid: doc.sid,
            uniqueName: doc.uniqueName,
            accountSid: doc.accountSid,
            serviceSid: doc.serviceSid,
            url: doc.url,
            revision: doc.revision,
            data: doc.data,
            dateCreated: doc.dateCreated,
            dateUpdated: doc.dateUpdated,
            createdBy: doc.createdBy,
        });
        log();
    }

    it('Should list Documents', (done: any) => {
        log('Listing Documents');
        serviceInstance.documents().list()
            .then((result: Document.Instance[]) => {
                log(`Received Document List with size ${result.length}`);
                assert.equal(result.length, 0);
            })
            .then(() => {
                log('Creating 10 Documents');
                const promises: Promise<Document.Instance>[] = [];
                for (let i = 0; i < 10; i++) {
                    promises.push(serviceInstance.documents().create({data: JSON.stringify({"da": "ta"})}));
                }
                return Promise.all(promises)
                    .then((result: Document.Instance[]) => {
                        log('Created 10 Documents:');
                        result.forEach(printDocument);
                    })
            })
            .then(() => {
                log('Querying 8 Documents with pageSize=3');
                return serviceInstance.documents().list({pageSize: 3, limit: 8})
                    .then((result: Document.Instance[]) => {
                        log(`Received Document List with size ${result.length}`);
                        assert.equal(result.length, 8);
                        result.forEach(printDocument);
                    });
            })
            .then(() => {
                log('Iterating over 8 Documents with pageSize=3');
                let documentsProcessed = 0;
                const eachOpts: Document.EachOpts = {
                    pageSize: 3,
                    limit: 8,
                    done: () => {
                        log('Document Iteration done');
                        assert.equal(documentsProcessed, 8);
                        done();
                    }    
                };
                const documentHandler = (doc: Document.Instance) => {
                    log('Received Document:');
                    printDocument(doc);
                    documentsProcessed++;        
                }; 
                serviceInstance.documents().each(eachOpts, documentHandler);
            })    
            .catch(done);
        }
    );

    it('Should CRUD Document', (done: any) => {
        const createOpts: Document.CreateOpts = {
            uniqueName: 'lgerz_name',
            data: JSON.stringify({
                my: 'little',
                pony: {
                    has: [ 'everything', 1, '', {} ]
                }
            })
        };
        log('Creating Document');
        serviceInstance.documents().create(createOpts)
            .then((doc: Document.Instance) => {
                log('Created Document');
                printDocument(doc);
                return doc;
            })
            .then((doc: Document.Instance) => {
                log('Fetching Document');
                return doc.fetch()
                    .then((doc: Document.Instance) => {
                        log('Fetched Document:');
                        printDocument(doc);
                        return doc;
                    });
            })
            .then((doc: Document.Instance) => {
                log('Updating Document');
                const updateRequest: Document.UpdateOpts = {
                    data: JSON.stringify({})
                };
                return doc.update(updateRequest)
                    .then((doc: Document.Instance) => {
                        log('Updated Document:');
                        printDocument(doc);
                        return doc;
                    })
            })
            .then((doc: Document.Instance) => {
                log('Removing Document');
                return doc.remove()
                    .then((success: boolean) => {
                        log(`Removed Document, success=${success}`);
                    });
            })
            .then(() => done())
            .catch(done);
        }
    );
});
