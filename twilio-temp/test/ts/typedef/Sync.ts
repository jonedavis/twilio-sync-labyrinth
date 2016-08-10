
interface Sync {
    services: Service.List;
}

// This type has no compiler-enforced null-safety and only serves as documentation. 
// TS 2.0 will have explicit null types (e.g., `thing: string | null`)
type Nullable<T> = T; 
 
// Plain JSON object. _Not_ `string` or `number`. 
// This is not enforced by the compiler as `number` and `string` both extend `Object`
type JSONObject = Object;
type JSONObjectAsString = string;

type Callback<T> = (error: Nullable<Error>, object: T) => void;

declare namespace Service {
    interface Context {
        fetch(callback?: Callback<Instance>): Promise<Instance>;
        update(opts: UpdateOpts, callback?: Callback<Instance>): Promise<Instance>;
        remove(callback?: Callback<boolean>): Promise<boolean>;
        documents(): Document.List;
        syncLists(): SyncList.List;
        syncMaps(): SyncMap.List;
    }
    interface Instance extends Context {
        sid: string;
        accountSid: string;
        friendlyName: Nullable<string>;
        dateCreated: Date;
        dateUpdated: Date;
        url: string;
        webhookUrl: Nullable<string>;
        links: {
            documents: string;
            lists: string;
            maps: string;
        };
    }

    interface List {
        create(opts?: CreateOpts, callback?: Callback<Instance>): Promise<Instance>;
        get(sid: string): Context;
        list(opts?: ListOpts, callback?: Callback<Instance[]>): Promise<Instance[]>;
        each(opts: EachOpts, callback: (service: Instance) => void): void;
        each(callback: (service: Instance) => void): void; 
    }
    interface ListOpts {
        pageSize?: number;
        limit?: number;
    }
    interface EachOpts extends ListOpts {
        done?: (error?: Error) => void;
    }
    interface CreateOpts {
        webhookUrl?: Nullable<string>;
        friendlyName?: Nullable<string>;
    }
    interface UpdateOpts {
        webhookUrl?: Nullable<string>;
        friendlyName?: Nullable<string>;
    }
}

declare namespace Document {
    interface Context {
        fetch(callback?: Callback<Instance>): Promise<Instance>;
        update(opts: UpdateOpts, callback?: Callback<Instance>): Promise<Instance>;
        remove(callback?: Callback<boolean>): Promise<boolean>;  
    }
    interface Instance extends Context{
        sid: string;
        uniqueName: Nullable<string>;
        accountSid: string;
        serviceSid: string;
        url: string;
        revision: string;
        data: JSONObject;
        dateCreated: Date;
        dateUpdated: Date;
        createdBy: string;
    }

    interface List {
        create(opts?: CreateOpts, callback?: Callback<Instance>): Promise<Instance>;
        get(sidOrUniqueName: string): Context;
        list(opts?: ListOpts, callback?: Callback<Instance[]>): Promise<Instance[]>;
        each(opts: EachOpts, callback: (document: Instance) => void): void;
        each(callback: (document: Instance) => void): void; 
    }
    interface ListOpts {
        pageSize?: number;
        limit?: number;
    }
    interface EachOpts extends ListOpts {
        done?: (error?: Error) => void;
    }
    interface CreateOpts {
        uniqueName?: string;
        data?: JSONObjectAsString;
    }
    interface UpdateOpts {
        data: JSONObjectAsString;
    }
}

declare namespace SyncList {
    interface Context {
        fetch(callback?: Callback<Instance>): Promise<Instance>;
        remove(callback?: Callback<boolean>): Promise<boolean>;
        syncListItems(): SyncListItem.List;
    }
    interface Instance extends Context {
        sid: string;
        uniqueName: Nullable<string>;
        serviceSid: string;
        accountSid: string;
        url: string;
        revision: string;
        dateCreated: Date;
        dateUpdated: Date;
        createdBy: string;
        links: {
            items: string;
        }
    }

    interface List {
        create(opts?: CreateOpts, callback?: Callback<Instance[]>): Promise<Instance>;
        get(sidOrUniqueName: string): Context;
        list(opts?: ListOpts, callback?: Callback<Instance[]>): Promise<Instance[]>;
        each(opts: EachOpts, callback: (syncMap: Instance) => void): void;
        each(callback: (syncMap: Instance) => void): void; 
    }
    interface ListOpts {
        limit?: number;
        pageSize?: number;
    }
    interface EachOpts extends ListOpts {
        done?: (error?: Error) => void;
    }
    interface CreateOpts {
        uniqueName?: string;
    }
}

declare namespace SyncListItem {
    interface Context {
        fetch(callback?: Callback<Instance>): Promise<Instance>;
        update(opts: UpdateOpts, callback?: Callback<Instance>): Promise<Instance>;    
        remove(callback?: Callback<boolean>): Promise<boolean>;
    }
    interface UpdateOpts {
        data: JSONObjectAsString;
    }
    interface Instance extends Context {
        index: number;
        accountSid: string;
        serviceSid: string;
        listSid: string;
        url: string;
        revision: string;
        data: JSONObject;
        dateCreated: Date;
        dateUpdated: Date;
        createdBy: Date;
    }

    interface List {
        create(opts: CreateOpts, callback?: Callback<Instance>): Promise<Instance>;
        get(index: number): Context;
        list(opts?: ListOpts, callback?: Callback<Instance>): Promise<Instance[]>;
        each(opts: EachOpts, callback: (syncListItem: Instance) => void): void;
        each(callback: (syncListItem: Instance) => void): void; 
    }
    interface CreateOpts {
        data: JSONObjectAsString;
    }
    interface ListOpts {
        order?: 'asc' | 'desc';
        from?: number;
        bounds?: 'inclusive' | 'exclusive';
        excludeData?: boolean;
        pageSize?: number;
        limit?: number;
    }
    interface EachOpts extends ListOpts {
        done?: (error: Error) => void;
    }
}


declare namespace SyncMap {
    interface Context {
        fetch(callback?: Callback<Instance>): Promise<Instance>;
        remove(callback?: Callback<boolean>): Promise<boolean>;
        syncMapItems(): SyncMapItem.List;
    }
    interface Instance extends Context {
        sid: string;
        uniqueName: Nullable<string>;
        serviceSid: string;
        accountSid: string;
        url: string;
        revision: string;
        dateCreated: Date;
        dateUpdated: Date;
        createdBy: string;
        links: {
            items: string;
        }
    }

    interface List {
        create(opts?: CreateOpts, callback?: Callback<Instance[]>): Promise<Instance>;
        get(sidOrUniqueName: string): Context;
        list(opts?: ListOpts, callback?: Callback<Instance[]>): Promise<Instance[]>;
        each(opts: EachOpts, callback: (syncMap: Instance) => void): void;
        each(callback: (syncMap: Instance) => void): void; 
    }
    interface ListOpts {
        limit?: number;
        pageSize?: number;
    }
    interface EachOpts extends ListOpts {
        done?: (error?: Error) => void;
    }
    interface CreateOpts {
        uniqueName?: string;
    }
}

declare namespace SyncMapItem {
    interface Context {
        fetch(callback?: Callback<Instance>): Promise<Instance>;
        update(opts: UpdateOpts, callback?: Callback<Instance>): Promise<Instance>;    
        remove(callback?: Callback<boolean>): Promise<boolean>;
    }
    interface UpdateOpts {
        data: JSONObjectAsString;
    }
    interface Instance extends Context {
        key: string;
        accountSid: string;
        serviceSid: string;
        mapSid: string;
        url: string;
        revision: string;
        data: JSONObject;
        dateCreated: Date;
        dateUpdated: Date;
        createdBy: Date;
    }

    interface List {
        create(opts: CreateOpts, callback?: Callback<Instance>): Promise<Instance>;
        get(key: string): Context;
        list(opts?: ListOpts, callback?: Callback<Instance>): Promise<Instance[]>;
        each(opts: EachOpts, callback: (syncMapItem: Instance) => void): void;
        each(callback: (syncMapItem: Instance) => void): void; 
    }
    interface CreateOpts {
        key: string;
        data: JSONObjectAsString;
    }
    interface ListOpts {
        order?: 'asc' | 'desc';
        from?: string;
        bounds?: 'inclusive' | 'exclusive';
        excludeData?: boolean;
        pageSize?: number;
        limit?: number;
    }
    interface EachOpts extends ListOpts {
        done?: (error: Error) => void;
    }
}
