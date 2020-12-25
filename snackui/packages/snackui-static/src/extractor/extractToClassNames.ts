import path from 'path'
import util from 'util'

import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import invariant from 'invariant'
import { MediaQueries } from 'snackui'
import { defaultMediaQueries } from 'snackui/node'

import { CSS_FILE_NAME } from '../constants'
import { getStylesAtomic } from '../css/getStylesAtomic'
import { Extractor } from '../extractor/createExtractor'
import { isSimpleSpread } from '../extractor/extractHelpers'
import { ClassNameObject, PluginOptions, StyleObject } from '../types'
import { babelParse } from './babelParse'
import { buildClassName } from './buildClassName'
import { ensureImportingConcat } from './ensureImportingConcat'
import { extractMediaStyle } from './extractMediaStyle'
import { hoistClassNames } from './hoistClassNames'

export const CONCAT_CLASSNAME_IMPORT = 'concatClassName'

export function extractToClassNames(
  extractor: Extractor,
  src: string | Buffer,
  sourceFileName: string,
  options: PluginOptions
): null | {
  js: string | Buffer
  css: string
  cssFileName: string
  ast: t.File
  map: any // RawSourceMap from 'source-map'
} {
  if (typeof src !== 'string') {
    throw new Error('`src` must be a string of javascript')
  }
  invariant(
    typeof sourceFileName === 'string' && path.isAbsolute(sourceFileName),
    '`sourceFileName` must be an absolute path to a .js file'
  )

  const shouldPrintDebug =
    (!!process.env.DEBUG &&
      (process.env.DEBUG_FILE
        ? sourceFileName.includes(process.env.DEBUG_FILE)
        : true)) ||
    (src[0] === '/' && src.startsWith('// debug'))

  // Using a map for (officially supported) guaranteed insertion order
  let ast: t.File

  try {
    ast = babelParse(src)
  } catch (err) {
    console.error(
      'babel parsing error',
      sourceFileName,
      err.message,
      '\n',
      err.stack
    )
    throw new Error(`Couldn't parse`)
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

          const addStyles = (style: any) => {
            if (!style) return []
            const res = getStylesAtomic(style, null, shouldPrintDebug)
            if (res.length) {
              finalStyles = [...finalStyles, ...res]
            }
            return res
          }

          if (viewStyles) {
            const styles = addStyles(viewStyles)
            for (const style of styles) {
              finalClassNames = [
                ...finalClassNames,
                t.stringLiteral(style.identifier),
              ]
            }
          }

          for (const attr of attrs) {
            switch (attr.type) {
              case 'attr':
                const val = attr.value
                if (t.isJSXSpreadAttribute(val)) {
                  if (isSimpleSpread(val)) {
                    finalClassNames.push(
                      t.memberExpression(
                        val.argument,
                        t.identifier('className')
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
                  shouldPrintDebug
                )
                if (mediaStyles) {
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
            const nameExpr = hoistClassNames(jsxPath, existingHoists, names)
            let expr = nameExpr
            if (!t.isIdentifier(nameExpr)) {
              ensureImportingConcat(programPath)
              // make it a safe access
              // todo add import to snackui
              expr = t.callExpression(t.identifier(CONCAT_CLASSNAME_IMPORT), [
                expr,
              ])
            }
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('className'),
                t.jsxExpressionContainer(expr)
              )
            )
          }

          const comment = util.format(
            '/* %s:%s (%s) */',
            filePath,
            lineNumbers,
            originalNodeName
          )

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

  const css = Array.from(cssMap.values())
    .map((v) => v.commentTexts.map((txt) => `${txt}\n`).join('') + v.css)
    .join(' ')
  const extName = path.extname(sourceFileName)
  const baseName = path.basename(sourceFileName, extName)
  const cssImportFileName = `./${baseName}${CSS_FILE_NAME}`
  const sourceDir = path.dirname(sourceFileName)
  const cssFileName = path.join(sourceDir, cssImportFileName)

  if (css !== '') {
    ast.program.body.unshift(
      t.importDeclaration([], t.stringLiteral(cssImportFileName))
    )
  }

  const result = generate(
    ast,
    {
      compact: 'auto',
      concise: false,
      filename: sourceFileName,
      // @ts-ignore
      quotes: 'single',
      retainLines: false,
      sourceFileName,
      sourceMaps: true,
    },
    src
  )

  if (shouldPrintDebug) {
    console.log(
      '\n\noutput code >> ',
      result.code
        .split('\n')
        .filter((line) => !line.startsWith('//'))
        .join('\n')
    )
    console.log('\n\noutput css >> ', css)
  }

  return {
    ast,
    cssFileName,
    css,
    js: result.code,
    map: result.map,
  }
}

// const classNameObjects: ClassNameObject[] = []
// const styles: ClassNameToStyleObj = {}
// node.attributes = node.attributes.filter((attr) => {
//   if (
//     !t.isJSXSpreadAttribute(attr) &&
//     attr.name &&
//     attr.name.name === 'className'
//   ) {
//     try {
//       const evaluatedValue = attemptEval(attr)
//       classNameObjects.push(t.stringLiteral(evaluatedValue))
//     } catch (e) {
//       // run without actually doing the funny stuf
//       const val = getPropValueFromAttributes('className', [attr])
//       if (!val) throw new Error(`unreachable`)
//       classNameObjects.push(val)
//     }
//     return false
//   }
//   return true
// })
// let finalClassName = buildClassName(classNameObjects)
// get extracted classNames
// const classNames: string[] = []
// const hasViewStyle = Object.keys(viewStyles).length > 0
// if (hasViewStyle) {
//   const styles = addStyles(viewStyles)
//   for (const style of styles) {
//     classNames.push(style.identifier)
//   }
// }
// if (ternaryExprs.length) {
//   if (finalClassName) {
//     finalClassName = t.binaryExpression(
//       '+',
//       // @ts-expect-error
//       buildClassName(ternaryExprs),
//       t.binaryExpression('+', t.stringLiteral(' '), finalClassName!)
//     )
//   } else {
//     // if no spread/className prop, we can optimize all the way
//     finalClassName = buildClassName(ternaryExprs)
//   }
// }
// if (classNames.length) {
//   finalClassName = (() => {
//     const next = t.stringLiteral(classNames.join(' '))
//     if (finalClassName) {
//       return buildClassName([finalClassName, next])
//     }
//     return next
//   })()
// }
