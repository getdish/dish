/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import anyTest, { TestInterface } from 'ava'

import { MutationFromWorker } from '../../transfer/Messages'
import { TransferrableKeys } from '../../transfer/TransferrableKeys'
import { TransferrableMutationType } from '../../transfer/TransferrableMutation'
import { NumericBoolean } from '../../utils'
import { Document } from '../../worker-thread/dom/Document'
import { Element } from '../../worker-thread/dom/Element'
import { Event } from '../../worker-thread/Event'
import { createTestingDocument } from '../DocumentCreation'
import { Emitter, emitter } from '../Emitter'

const test = anyTest as TestInterface<{
  document: Document
  div: Element
  eventHandler: (e: Event) => any
  emitter: Emitter
}>

test.beforeEach((t) => {
  const document = createTestingDocument()
  const div = document.createElement('div')

  function eventHandler(e: Event) {
    console.log(e, 'yay')
  }

  t.context = {
    document,
    div,
    eventHandler,
    emitter: emitter(document),
  }
})

test.serial.cb('Node.addEventListener transfers an event subscription', (t) => {
  const { div, eventHandler, emitter } = t.context

  function transmitted(
    strings: Array<string>,
    message: MutationFromWorker,
    buffers: Array<ArrayBuffer>
  ) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [
        TransferrableMutationType.EVENT_SUBSCRIPTION,
        div[TransferrableKeys.index],
        0,
        1,
        strings.indexOf('click'),
        0, // This is the first event registered.
        NumericBoolean.FALSE,
        NumericBoolean.FALSE,
        NumericBoolean.FALSE,
        NumericBoolean.FALSE,
      ],
      'mutation is as expected'
    )
    t.end()
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted)
    div.addEventListener('click', eventHandler)
  })
})

test.serial.cb(
  'Node.addEventListener(..., {capture: true}) transfers an event subscription',
  (t) => {
    const { div, eventHandler, emitter } = t.context

    function transmitted(
      strings: Array<string>,
      message: MutationFromWorker,
      buffers: Array<ArrayBuffer>
    ) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.TRUE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
        ],
        'mutation is as expected'
      )
      t.end()
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted)
      div.addEventListener('click', eventHandler, { capture: true })
    })
  }
)

test.serial.cb(
  'Node.addEventListener(..., {once: true}) transfers an event subscription',
  (t) => {
    const { div, eventHandler, emitter } = t.context

    function transmitted(
      strings: Array<string>,
      message: MutationFromWorker,
      buffers: Array<ArrayBuffer>
    ) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.FALSE,
          NumericBoolean.TRUE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
        ],
        'mutation is as expected'
      )
      t.end()
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted)
      div.addEventListener('click', eventHandler, { once: true })
    })
  }
)

test.serial.cb(
  'Node.addEventListener(..., {passive: true}) transfers an event subscription',
  (t) => {
    const { div, eventHandler, emitter } = t.context

    function transmitted(
      strings: Array<string>,
      message: MutationFromWorker,
      buffers: Array<ArrayBuffer>
    ) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.TRUE,
          NumericBoolean.FALSE,
        ],
        'mutation is as expected'
      )
      t.end()
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted)
      div.addEventListener('click', eventHandler, { passive: true })
    })
  }
)

test.serial.cb(
  'Node.addEventListener(..., {workerDOMPreventDefault: true}) transfers an event subscription',
  (t) => {
    const { div, eventHandler, emitter } = t.context

    function transmitted(
      strings: Array<string>,
      message: MutationFromWorker,
      buffers: Array<ArrayBuffer>
    ) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.TRUE,
        ],
        'mutation is as expected'
      )
      t.end()
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted)
      div.addEventListener('click', eventHandler, {
        workerDOMPreventDefault: true,
      })
    })
  }
)
