declare module "job_processor" {
    import { WorkerJob } from '@dish/worker';
    import { Job } from 'bull';
    let klass_map: {
        [key: string]: typeof WorkerJob;
    };
    export { klass_map };
    const _default: (job: Job) => Promise<void>;
    export default _default;
}
declare module "@dish/worker-app" { }
