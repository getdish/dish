import { DEBUG_LEVEL } from '@dish/worker'

export class Loggable {
  #start_time!: [number, number]

  get logName(): string | undefined {
    return this.constructor.name || '...'
  }

  log = (...messages: any[]) => {
    if (DEBUG_LEVEL < 2 || DEBUG_LEVEL === undefined) {
      return
    }
    const time = this.elapsedTime() + 's'
    const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'Mb'
    console.log(`${this.logName}: ${messages.join(' ')} | ${time} | ${memory}`)
  }

  elapsedTime() {
    if (!this.#start_time) {
      this.#start_time = process.hrtime()
    }
    const elapsed = process.hrtime(this.#start_time)[0]
    this.#start_time = process.hrtime()
    return elapsed
  }

  resetTimer() {
    this.#start_time = process.hrtime()
  }
}
