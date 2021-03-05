declare module "ProxiedRequests" {
    import { AxiosRequestConfig } from 'axios';
    export class ProxiedRequests {
        domain: string;
        aws_proxy: string;
        config: AxiosRequestConfig;
        start_with_aws: boolean;
        constructor(domain: string, aws_proxy: string, config?: AxiosRequestConfig, start_with_aws?: boolean);
        get(uri: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any>>;
        luminatiBaseConfig(): {
            host: string | undefined;
            port: string | undefined;
        };
        luminatiDatacentreConfig(): {
            auth: string;
            host: string | undefined;
            port: string | undefined;
        };
        luminatiResidentialConfig(): {
            auth: string;
            host: string | undefined;
            port: string | undefined;
        };
    }
}
declare module "WorkerJob" {
    import BullQueue, { Job, JobOptions, Queue, QueueOptions } from 'bull';
    export const redisOptions: {
        port: number;
        host: string | undefined;
    };
    export type JobData = {
        className: string;
        fn: string;
        args?: any;
    };
    export class WorkerJob {
        static queue_config: QueueOptions;
        static job_config: JobOptions;
        queue: Queue;
        job: Job;
        run(fn: string, args?: any[]): Promise<void>;
        runOnWorker(fn: string, args?: any[], specific_config?: JobOptions): Promise<void>;
        private addJob;
        private manageRepeatable;
        addBigJob(fn: string, args: any[]): Promise<void | BullQueue.Job<any>>;
    }
    export function getBullQueue(name: string, config?: {}): Promise<BullQueue.Queue<any>>;
}
declare module "@dish/worker" {
    export { redisOptions, JobData, WorkerJob, getBullQueue } from "WorkerJob";
    export { ProxiedRequests } from "ProxiedRequests";
}
