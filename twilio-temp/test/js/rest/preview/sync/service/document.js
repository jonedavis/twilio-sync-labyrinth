'use strict';
var index_1 = require('../../../../index');
var chai_1 = require('chai');
var log = console.log;
describe('Document', function () {
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
    function printDocument(doc) {
        log('Document: ');
        index_1.prettyPrint({
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
    it('Should list Documents', function (done) {
        log('Listing Documents');
        serviceInstance.documents().list()
            .then(function (result) {
            log("Received Document List with size " + result.length);
            chai_1.assert.equal(result.length, 0);
        })
            .then(function () {
            log('Creating 10 Documents');
            var promises = [];
            for (var i = 0; i < 10; i++) {
                promises.push(serviceInstance.documents().create({ data: JSON.stringify({ "da": "ta" }) }));
            }
            return Promise.all(promises)
                .then(function (result) {
                log('Created 10 Documents:');
                result.forEach(printDocument);
            });
        })
            .then(function () {
            log('Querying 8 Documents with pageSize=3');
            return serviceInstance.documents().list({ pageSize: 3, limit: 8 })
                .then(function (result) {
                log("Received Document List with size " + result.length);
                chai_1.assert.equal(result.length, 8);
                result.forEach(printDocument);
            });
        })
            .then(function () {
            log('Iterating over 8 Documents with pageSize=3');
            var documentsProcessed = 0;
            var eachOpts = {
                pageSize: 3,
                limit: 8,
                done: function () {
                    log('Document Iteration done');
                    chai_1.assert.equal(documentsProcessed, 8);
                    done();
                }
            };
            var documentHandler = function (doc) {
                log('Received Document:');
                printDocument(doc);
                documentsProcessed++;
            };
            serviceInstance.documents().each(eachOpts, documentHandler);
        })
            .catch(done);
    });
    it('Should CRUD Document', function (done) {
        var createOpts = {
            uniqueName: 'lgerz_name',
            data: JSON.stringify({
                my: 'little',
                pony: {
                    has: ['everything', 1, '', {}]
                }
            })
        };
        log('Creating Document');
        serviceInstance.documents().create(createOpts)
            .then(function (doc) {
            log('Created Document');
            printDocument(doc);
            return doc;
        })
            .then(function (doc) {
            log('Fetching Document');
            return doc.fetch()
                .then(function (doc) {
                log('Fetched Document:');
                printDocument(doc);
                return doc;
            });
        })
            .then(function (doc) {
            log('Updating Document');
            var updateRequest = {
                data: JSON.stringify({})
            };
            return doc.update(updateRequest)
                .then(function (doc) {
                log('Updated Document:');
                printDocument(doc);
                return doc;
            });
        })
            .then(function (doc) {
            log('Removing Document');
            return doc.remove()
                .then(function (success) {
                log("Removed Document, success=" + success);
            });
        })
            .then(function () { return done(); })
            .catch(done);
    });
});
