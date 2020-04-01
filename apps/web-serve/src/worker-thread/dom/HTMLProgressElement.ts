/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TransferrableKeys } from '../../transfer/TransferrableKeys'
import { registerSubclass } from './Element'
import { reflectProperties } from './enhanceElement'
import { HTMLElement } from './HTMLElement'
import { HTMLInputLabelsMixin } from './HTMLInputLabelsMixin'

export class HTMLProgressElement extends HTMLElement {
  private [TransferrableKeys.indeterminate]: boolean = true
  private [TransferrableKeys.value]: number = 0

  get position(): number {
    return this[TransferrableKeys.indeterminate]
      ? -1
      : this[TransferrableKeys.value] / this.max
  }

  get value(): number {
    return this[TransferrableKeys.value]
  }
  set value(value: number) {
    this[TransferrableKeys.indeterminate] = false
    this[TransferrableKeys.value] = value
    // TODO(KB) This is a property mutation needing tracked.
  }
}
registerSubclass('progress', HTMLProgressElement)
HTMLInputLabelsMixin(HTMLProgressElement)

// Reflected Properties
// HTMLModElement.max => number, reflected attribute
reflectProperties([{ max: [1] }], HTMLProgressElement)
