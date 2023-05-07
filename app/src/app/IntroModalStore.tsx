import { Store } from '@tamagui/use-store'

export class IntroModalStore extends Store {
  hidden = true
  started = false

  setHidden(val: boolean) {
    this.started = true
    this.hidden = val
  }
}
