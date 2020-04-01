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

import { WorkerDOMConfiguration } from '../configuration'
import { NodeContext } from '../nodes'
import { ObjectContext } from '../object-context'
import { StringContext } from '../strings'
import { WorkerContext } from '../worker'

export interface CommandExecutor {
  /**
   * If `allow` is true, executes `mutations[startPosition]`. Otherwise, noop.
   * @param mutations
   * @param startPosition
   * @param allow
   * @return The index (startPosition) of the next mutation.
   */
  execute(mutations: Uint16Array, startPosition: number, allow: boolean): number

  print(mutations: Uint16Array, startPosition: number): Object
}

export interface CommandExecutorInterface {
  (
    stringContext: StringContext,
    nodeContext: NodeContext,
    workerContext: WorkerContext,
    objectContext: ObjectContext,
    config: WorkerDOMConfiguration
  ): CommandExecutor
}
