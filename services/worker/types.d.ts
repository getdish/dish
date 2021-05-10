declare module "@dish/worker-app" {
    import { WorkerJob } from "@dish/worker";
    import { Job } from "bull";
    let klass_map: {
        [key: string]: typeof WorkerJob;
    };
    export { klass_map };
    const _default: (job: Job) => Promise<void>;
    export default _default;
}
//# sourceMappingURL=types.d.ts.map
