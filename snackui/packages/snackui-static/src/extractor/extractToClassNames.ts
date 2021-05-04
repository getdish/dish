import { basename, join } from 'path'
import * as path from 'path'
import * as util from 'util'

import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { MediaQueries, defaultMediaQueries } from '@snackui/node'
import { writeFileSync } from 'fs-extra'
import invariant from 'invariant'
import { ViewStyle } from 'react-native'

import { cacheDir, shouldInternalDedupe } from '../constants'
import { Extractor } from '../extractor/createExtractor'
import { isSimpleSpread } from '../extractor/extractHelpers'
import { getStylesAtomic } from '../getStylesAtomic'
import { ClassNameObject, SnackOptions, StyleObject } from '../types'
import { babelParse } from './babelParse'
import { buildClassName } from './buildClassName'
import { ensureImportingConcat } from './ensureImportingConcat'
import { extractMediaStyle } from './extractMediaStyle'
import { hoistClassNames } from './hoistClassNames'

export const CONCAT_CLASSNAME_IMPORT = 'concatClassName'

let initialFileName = ''
export function getInitialFileName() {
  return initialFileName
}

const mergeStyleGroups = [new Set(['shadowOpacity', 'shadowRadius', 'shadowColor', 'shadowOffset'])]

export function extractToClassNames(
  extractor: Extractor,
  src: string | Buffer,
  sourceFileName: string,
  options: SnackOptions,
  addDependency: (path: string) => void,
  shouldPrintDebug: boolean
): null | {
  js: string | Buffer
  styles: string
  stylesPath?: string
  ast: t.File
  map: any // RawSourceMap from 'source-map'
} {
  if (typeof src !== 'string') {
    throw new Error('`src` must be a string of javascript')
  }
  if (!sourceFileName.endsWith('sx')) {
    return null
  }
  invariant(
    typeof sourceFileName === 'string' && path.isAbsolute(sourceFileName),
    '`sourceFileName` must be an absolute path to a .js file'
  )

  const shouldLogTiming = shouldPrintDebug || options.logTimings
  const start = Date.now()
  const mem = shouldLogTiming ? process.memoryUsage() : null

  // Using a map for (officially supported) guaranteed insertion order
  let ast: t.File

  try {
    ast = babelParse(src)
  } catch (err) {
    console.error('babel parse error:', sourceFileName)
    throw err
  }

  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()
  const existingHoists: { [key: string]: t.Identifier } = {}
  const mediaQueries: MediaQueries = options.mediaQueries ?? defaultMediaQueries

  let didExtract = false

  traverse(ast, {
    Program(programPath) {
      extractor.parse(programPath, {
        sourceFileName,
        shouldPrintDebug,
        ...options,
        getFlattenedNode: ({ isTextView }) => {
          return isTextView ? 'span' : 'div'
        },
        onExtractTag: ({
          attrs,
          node,
          attemptEval,
          viewStyles,
          jsxPath,
          originalNodeName,
          filePath,
          lineNumbers,
        }) => {
          didExtract = true

          let finalClassNames: ClassNameObject[] = []
          let finalAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
          let finalStyles: StyleObject[] = []

          const mergeInParentStyles = (style: ViewStyle) => {
            const keys = Object.keys(style)
            for (const group of mergeStyleGroups) {
              if (keys.some((key) => group.has(key))) {
                // ensure all other keys exist on this group
                for (const groupKey of [...group]) {
                  if (viewStyles[groupKey]) {
                    style[groupKey] = style[groupKey] ?? viewStyles[groupKey]
                  }
                }
              }
            }
            return style
          }

          const addStyles = (style: ViewStyle | null) => {
            if (!style) return []
            const res = getStylesAtomic(mergeInParentStyles(style))
            if (res.length) {
              finalStyles = [...finalStyles, ...res]
            }
            return res
          }

          if (viewStyles) {
            const styles = addStyles(viewStyles)
            for (const style of styles) {
              finalClassNames = [...finalClassNames, t.stringLiteral(style.identifier)]
            }
          }

          let lastMediaImportance = 0
          for (const attr of attrs) {
            switch (attr.type) {
              case 'attr':
                const val = attr.value
                if (t.isJSXSpreadAttribute(val)) {
                  if (isSimpleSpread(val)) {
                    finalClassNames.push(
                      t.logicalExpression(
                        '&&',
                        val.argument,
                        t.memberExpression(val.argument, t.identifier('className'))
                      )
                    )
                  }
                } else if (val.name.name === 'className') {
                  const value = val.value
                  if (value) {
                    try {
                      const evaluatedValue = attemptEval(value)
                      finalClassNames.push(t.stringLiteral(evaluatedValue))
                    } catch (e) {
                      finalClassNames.push(value['expression'])
                    }
                  }
                  continue
                }
                finalAttrs.push(val)
                break
              case 'ternary':
                const mediaStyles = extractMediaStyle(
                  attr.value,
                  jsxPath,
                  mediaQueries,
                  sourceFileName,
                  lastMediaImportance,
                  shouldPrintDebug
                )
                if (mediaStyles) {
                  lastMediaImportance++
                  finalStyles = [...finalStyles, ...mediaStyles]
                  finalClassNames = [
                    ...finalClassNames,
                    ...mediaStyles.map((x) => t.stringLiteral(x.identifier)),
                  ]
                  continue
                }
                const ternary = attr.value
                const consInfo = addStyles(ternary.consequent)
                const altInfo = addStyles(ternary.alternate)
                const cCN = consInfo.map((x) => x.identifier).join(' ')
                const aCN = altInfo.map((x) => x.identifier).join(' ')
                if (consInfo.length && altInfo.length) {
                  finalClassNames.push(
                    t.conditionalExpression(
                      ternary.test,
                      t.stringLiteral(cCN),
                      t.stringLiteral(aCN)
                    )
                  )
                } else {
                  finalClassNames.push(
                    t.conditionalExpression(
                      ternary.test,
                      t.stringLiteral(' ' + cCN),
                      t.stringLiteral(' ' + aCN)
                    )
                  )
                }
                break
            }
          }

          node.attributes = finalAttrs

          if (finalClassNames.length) {
            // inserts the _cn variable and uses it for className
            const names = buildClassName(finalClassNames)
            const nameExpr = names ? hoistClassNames(jsxPath, existingHoists, names) : null
            let expr = nameExpr

            // if has some spreads, use concat helper
            if (nameExpr && !t.isIdentifier(nameExpr)) {
              ensureImportingConcat(programPath)
              const simpleSpreads = attrs.filter(
                (x) => t.isJSXSpreadAttribute(x.value) && isSimpleSpread(x.value)
              )
              expr = t.callExpression(t.identifier(CONCAT_CLASSNAME_IMPORT), [
                expr,
                ...simpleSpreads.map((val) => val.value['argument']),
              ])
            }

            node.attributes.push(
              t.jsxAttribute(t.jsxIdentifier('className'), t.jsxExpressionContainer(expr))
            )
          }

          const comment = util.format('/* %s:%s (%s) */', filePath, lineNumbers, originalNodeName)

          for (const { className, rules } of finalStyles) {
            if (cssMap.has(className)) {
              if (comment) {
                const val = cssMap.get(className)!
                val.commentTexts.push(comment)
                cssMap.set(className, val)
              }
            } else if (rules.length) {
              if (rules.length > 1) {
                console.log('  ', { rules })
                throw new Error(`Shouldn't have more than one rule`)
              }
              cssMap.set(className, {
                css: rules[0],
                commentTexts: [comment],
              })
            }
          }
        },
      })
    },
  })

  if (!didExtract) {
    return null
  }

  // if (shouldPrintDebug) {
  //   console.log(' cssmap', cssMap.values())
  // }

  const styles = Array.from(cssMap.values())
    .map((x) => {
      // remove comments
      return x.css //shouldInternalDedupe ? x.css : `${x.commentTexts.join('\n')}\n${x.css}`
    })
    .join('\n')
    .trim()

  let stylesPath: string | undefined

  if (styles) {
    // add import to styles file
    let importPath = ''
    if (shouldInternalDedupe) {
      // in dev mode, dedupe ourselves
      initialFileName = initialFileName || sourceFileName
      importPath = `/tmp/snackui.css!=!snackui-loader?cssPath=true!${initialFileName}`
    } else {
      // otherwise we write out to fs to unique place
      const cachePath = `${basename(sourceFileName.replace(/[\/\.]/g, '-'))}.css`
      stylesPath = join(cacheDir, cachePath)
      writeFileSync(stylesPath, styles)
      importPath = `${stylesPath}!=!snackui-loader?cssPath=true!${stylesPath}`
      addDependency(importPath)
    }
    ast.program.body.unshift(t.importDeclaration([], t.stringLiteral(importPath)))
  }

  const result = generate(
    ast,
    {
      concise: false,
      filename: sourceFileName,
      retainLines: false,
      sourceFileName,
      sourceMaps: true,
    },
    src
  )

  if (shouldPrintDebug) {
    console.log('\n\n -------- output code ------- \n\n', result.code)
    console.log('\n\n -------- output style -------- \n\n', styles)
  }

  if (shouldLogTiming && mem) {
    const memUsed =
      Math.round(((process.memoryUsage().heapUsed - mem.heapUsed) / 1024 / 1204) * 10) / 10
    // prettier-ignore
    console.log('  🍑 ', Date.now() - start, 'ms', memUsed, 'MB mem', basename(sourceFileName), '[SnackUI]')
  }

  return {
    ast,
    styles,
    stylesPath,
    js: result.code,
    map: result.map,
  }
}
