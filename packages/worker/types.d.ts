/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/worker" {
    export class Loggable {
        #private;
        get logName(): string | undefined;
        log(...messages: any[]): void;
        elapsedTime(): number;
        resetTimer(): void;
    }
}

declare module "@dish/worker" {
    export function fetchBrowserJSON(url: string): Promise<any>;
    export function fetchBrowserHyperscript(url: string, selector: string): Promise<any>;
    export function fetchBrowserHTML(url: string): Promise<string>;
}

declare module "@dish/worker" {
    import { FetchOptions } from "make-fetch-happen";
    type Opts = FetchOptions & {
        skipBrowser?: boolean;
    };
    export class ProxiedRequests {
        domain: string;
        aws_proxy: string;
        config: Opts;
        start_with_aws: boolean;
        constructor(domain: string, aws_proxy: string, config?: Opts, start_with_aws?: boolean);
        getJSON(uri: string, props?: Opts): Promise<any>;
        getHyperscript(uri: string, selector: string): Promise<any>;
        getText(uri: string, props?: Opts): Promise<any>;
        get(uri: string, props?: Opts): Promise<any>;
        getStormProxyConfig(): {
            host: string;
            port: number;
            protocol: string;
        };
        luminatiBaseConfig(): {
            protocol: string;
            host: string;
            port: number;
        };
        luminatiProxyConfig(): {
            auth: {
                username: string;
                password: string;
            };
            protocol: string;
            host: string;
            port: number;
        };
        luminatiResidentialConfig(): {
            auth: {
                username: string;
                password: string;
            };
            protocol: string;
            host: string;
            port: number;
        };
    }
}

declare module "@dish/worker" {
    import Bull from "bull";
    import { Job, JobOptions, Queue, QueueOptions } from "bull";
    export type JobData = {
        className: string;
        fn: string;
        args?: any;
    };
    export class WorkerJob extends Loggable {
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        queue: Queue;
        job: Job;
        run_all_on_main: boolean;
        run(fn: string, args?: any[]): Promise<void>;
        runOnWorker(fn: string, args?: any[], specific_config?: JobOptions): Promise<void>;
        _runFailableFunction(func: Function): Promise<void>;
        private addJob;
        private manageRepeatable;
        addBigJob(fn: string, args: any[]): Promise<void | Bull.Job<any>>;
    }
    export function getBullQueue(name: string, config?: {}): Bull.Queue<any>;
    export function onBullQueueReady(queue: Bull.Queue): Promise<void>;
}

declare module "@dish/worker" {
    export const DEBUG_LEVEL: number;
}
//# sourceMappingURL=types.d.ts.map
