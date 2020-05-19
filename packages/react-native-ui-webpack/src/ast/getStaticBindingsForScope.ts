import path from 'path'

import * as t from '@babel/types'
import fs from 'fs-extra'

import { evaluateAstNode } from './evaluateAstNode'
import { getSourceModule } from './getSourceModule'

export interface BindingCache {
  [key: string]: string | null
}

interface Binding {
  identifier: any
  scope: any
  path: any
  // this list is incomplete
  kind: 'module' | 'let' | 'const' | 'var' | 'param' | 'hoisted' | 'local'

  constantViolations: any[]
  constant: boolean

  referencePaths: any[] // NodePath[]
  referenced: boolean
  references: number

  hasDeoptedValue: boolean
  hasValue: boolean
  value: any
}

export function getStaticBindingsForScope(
  scope: any,
  sourceFileName: string,
  bindingCache: BindingCache,
  whitelistStaticModules: string[] = [],
  execFile: (str: string) => any
): Record<string, any> {
  const bindings: Record<string, Binding> = scope.getAllBindings()
  const ret: Record<string, any> = {}
  const sourceDir = path.dirname(sourceFileName)

  if (!bindingCache) {
    throw new Error('bindingCache is a required param')
  }

  for (const k in bindings) {
    const binding = bindings[k]

    // check to see if the item is a module
    const sourceModule = getSourceModule(k, binding)
    if (sourceModule) {
      if (!sourceModule.sourceModule) {
        continue
      }
      let moduleName = sourceModule.sourceModule

      // if modulePath is an absolute or relative path
      if (moduleName.startsWith('.') || moduleName.startsWith('/')) {
        const fullPath = path.resolve(sourceDir, moduleName)
        // if moduleName doesn't end with an extension, add .js
        if (path.extname(moduleName) === '') {
          if (fs.pathExistsSync(fullPath + '.ts')) {
            moduleName += '.ts'
          } else if (fs.pathExistsSync(fullPath + '.tsx')) {
            moduleName += '.ts'
          } else {
            moduleName += '.js'
          }
        }
        // get absolute path
        moduleName = path.resolve(sourceDir, moduleName)
      }

      if (sourceModule.destructured) {
        if (whitelistStaticModules.includes(moduleName)) {
          if (sourceModule.imported) {
            const out = execFile(moduleName)
            ret[k] = out[sourceModule.imported]
          }
        }
      }
    } else {
      const { parent, parentPath } = binding.path

      if (!t.isVariableDeclaration(parent) || parent.kind !== 'const') {
        continue
      }
      // pick out the right variable declarator
      const dec = parent.declarations.find(
        (d) => t.isIdentifier(d.id) && d.id.name === k
      )
      // if init is not set, there's nothing to evaluate
      // TODO: handle spread syntax
      if (!dec || !dec.init) {
        continue
      }
      // missing start/end will break caching
      if (typeof dec.id.start !== 'number' || typeof dec.id.end !== 'number') {
        console.error('dec.id.start/end is not a number')
        continue
      }
      if (!t.isIdentifier(dec.id)) {
        console.error('dec is not an identifier')
        continue
      }

      const cacheKey = `${dec.id.name}_${dec.id.start}-${dec.id.end}`
      // retrieve value from cache
      if (bindingCache[cacheKey]) {
        ret[k] = bindingCache[cacheKey]
        continue
      }

      // skip ObjectExpressions not defined in the root
      if (
        t.isObjectExpression(dec.init) &&
        parentPath.parentPath.type !== 'Program'
      ) {
        continue
      }

      // evaluate
      try {
        ret[k] = evaluateAstNode(dec.init)
        bindingCache[cacheKey] = ret[k]
        continue
      } catch (e) {
        // console.error('evaluateAstNode could not eval dec.init:', e);
      }
    }
  }

  return ret
}
