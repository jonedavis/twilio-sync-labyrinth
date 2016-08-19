declare function describe(suiteName: string, suite: Function): any;
declare function it(testName: string, test: Function): any;

declare function before(f: Function): any;
declare function before(name: string, f: Function): any;

declare function after(f: Function): any;
declare function after(name: string, f: Function): any;

declare module 'chai' {
    export const assert: any;
}