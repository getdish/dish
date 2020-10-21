import { Store } from '@dish/use-store'

export class IntroModal extends Store {
  hidden = true
  started = false

  setHidden(val: boolean) {
    this.started = true
    this.hidden = val
  }
}
