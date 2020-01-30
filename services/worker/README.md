## Worker development
All code that a worker might have to run needs to be imported in `job_process.ts`. The job queues serialize the name of the inherited `WorkerJob` class and the arguments sent to its `run()` command. It is obviously complex for the job queues to also store code to be run, so the code to be run is stored in the worker. A worker can then run on machines other than the
machine that requested the job to be run.

Run a worker daemon with: `nodemon _/index.js`. It will listen to jobs from the central
Redis server.

To add jobs to the worker queues see: `packages/worker`

The basic idea is that worker code must conform to the following:

```js
class MyWorker extends WorkerJob {
  run(args?: any) {
    // Entrypoint into work to do
  }
}
```

## Worker web UI
View the status of jobs on all workers:

```
docker run \
  --rm \
  -p 3000 \
  jondum/bull-board:latest
```

