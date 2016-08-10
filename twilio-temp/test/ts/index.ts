'use strict';

function prettyPrint(obj: any) {
    console.log(JSON.stringify(obj, null, 2));
}

declare function require(moduleName: string): any;
const Twilio = require('../../index');
const client = new Twilio('ACxx', 'secret');
const Sync: Sync = client.preview.sync;


function createInstance(opts?: Service.CreateOpts): Promise<Service.Instance> {
    console.log('Creating Service Instance');
    return Sync.services.create(opts)
        .then((result: Service.Instance) => {
            console.log(`Created Service Instance ${result.sid}`);
            return result;
        })
}
function removeInstance(si: Service.Instance): Promise<boolean> {
    console.log(`Removing Service Instance ${si.sid}`);
    return si.remove()
        .then((success: boolean) => {
            console.log(`Removed Service Instance ${si.sid}`);
            return success;
        })
}

export {
    prettyPrint,
    Sync,
    createInstance,
    removeInstance
};
