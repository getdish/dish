import path from 'path'
import util from 'util'
import vm from 'vm'

import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
// hardcoding for now because i cant import dish/ui even with module-alias for react-native-web
import * as AllExports from '@dish/ui'
// import literalToAst from 'babel-literal-to-ast'
import invariant from 'invariant'
import { ViewStyle } from 'react-native'
import { resolve } from 'react-native-web/dist/cjs/exports/StyleSheet/styleResolver'

import { GLOSS_CSS_FILE } from '../constants'
import { getStylesAtomic } from '../style/getStylesAtomic'
import styleProps from '../style/styleProps'
import {
  CacheObject,
  ClassNameToStyleObj,
  ExtractStylesOptions,
} from '../types'
import { evaluateAstNode } from './evaluateAstNode'
import {
  Ternary,
  TernaryRecord,
  extractStaticTernaries,
} from './extractStaticTernaries'
import { getPropValueFromAttributes } from './getPropValueFromAttributes'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { parse } from './parse'

type OptimizableComponent = Function & {
  staticConfig: {
    defaultStyle: any
    styleExpansionProps?: {
      // eg: <ZStack fullscreen />, { fullscreen: { position: 'absolute', ... } }
      [key: string]: Object
    }
  }
}

const validComponents: { [key: string]: OptimizableComponent } = Object.keys(
  AllExports
)
  .filter((key) => !!AllExports[key]?.staticConfig)
  .reduce((obj, name) => {
    obj[name] = AllExports[name]
    return obj
  }, {})

export interface Options {
  cacheObject: CacheObject
  errorCallback?: (str: string, ...args: any[]) => void
  warnCallback?: (str: string, ...args: any[]) => void
}

type ClassNameObject = t.StringLiteral | t.Expression

interface TraversePath<TNode = any> {
  node: TNode
  scope: {} // TODO
  _complexComponentProp?: any // t.VariableDeclarator;
  parentPath: TraversePath<any>
  insertBefore: (arg: t.Node) => void
}

const UNTOUCHED_PROPS = {
  key: true,
  style: true,
  className: true,
}

// per-file cache of evaluated bindings
const bindingCache: Record<string, string | null> = {}

export function extractStyles(
  src: string | Buffer,
  sourceFileName: string,
  { cacheObject, errorCallback }: Options,
  userOptions: ExtractStylesOptions
): {
  js: string | Buffer
  css: string
  cssFileName: string | null
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
  invariant(
    typeof cacheObject === 'object' && cacheObject !== null,
    '`cacheObject` must be an object'
  )

  const options: ExtractStylesOptions = {
    evaluateVars: true,
    ...userOptions,
  }

  const sourceDir = path.dirname(sourceFileName)

  // Using a map for (officially supported) guaranteed insertion order
  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()
  const ast = parse(src)
  let doesImport = false
  const shouldPrintDebug = !!process.env.DEBUG

  // Find gloss require in program root
  let foundComponents = {}
  ast.program.body = ast.program.body.filter((item: t.Node) => {
    if (t.isImportDeclaration(item)) {
      if (item.source.value !== '@dish/ui') {
        doesImport = true
        return true
      }
      item.specifiers = item.specifiers.filter((specifier) => {
        if (!validComponents[specifier.local.name]) {
          return true
        }
        foundComponents[specifier.local.name] = true
        return true
      })
    }
    return true
  })

  // gloss isn't included anywhere, so let's bail
  if (!doesImport || !Object.keys(foundComponents).length) {
    return {
      ast,
      css: '',
      cssFileName: null,
      js: src,
      map: null,
    }
  }

  /**
   * Step 2: Statically extract from JSX < /> nodes
   */
  traverse(ast, {
    JSXElement: {
      enter(traversePath: TraversePath<t.JSXElement>) {
        const node = traversePath.node.openingElement

        if (
          // skip non-identifier opening elements (member expressions, etc.)
          !t.isJSXIdentifier(node.name) ||
          // skip non-gloss components
          !validComponents[node.name.name]
        ) {
          return
        }

        // Remember the source component
        const component = validComponents[node.name.name]
        const originalNodeName = node.name.name

        if (shouldPrintDebug) {
          console.log('node', originalNodeName)
        }

        let domNode = 'div'

        const isStaticAttributeName = (name: string) => !!styleProps[name]
        const attemptEval = !options.evaluateVars
          ? evaluateAstNode
          : (() => {
              // Generate scope object at this level
              const staticNamespace = getStaticBindingsForScope(
                traversePath.scope,
                [],
                sourceFileName,
                bindingCache
              )

              if (shouldPrintDebug) {
                console.log('staticNamespace', staticNamespace)
              }

              const evalContext = vm.createContext(staticNamespace)

              // called when evaluateAstNode encounters a dynamic-looking prop
              const evalFn = (n: t.Node) => {
                // variable
                if (t.isIdentifier(n)) {
                  invariant(
                    staticNamespace.hasOwnProperty(n.name),
                    'identifier not in staticNamespace'
                  )
                  return staticNamespace[n.name]
                }
                return vm.runInContext(`(${generate(n).code})`, evalContext)
              }

              return (n: t.Node) => {
                try {
                  return evaluateAstNode(n, evalFn)
                } catch (err) {
                  // if (shouldPrintDebug) {
                  //   console.log('evaluation error, ok if its dynamic:', err)
                  // }
                  throw err
                }
              }
            })()

        let lastSpreadIndex: number = -1
        const flattenedAttributes: (
          | t.JSXAttribute
          | t.JSXSpreadAttribute
        )[] = []

        node.attributes.forEach((attr) => {
          if (t.isJSXSpreadAttribute(attr)) {
            try {
              const spreadValue = attemptEval(attr.argument)

              if (typeof spreadValue !== 'object' || spreadValue == null) {
                lastSpreadIndex = flattenedAttributes.push(attr) - 1
              } else {
                for (const k in spreadValue) {
                  const value = spreadValue[k]

                  if (typeof value === 'number') {
                    flattenedAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(k),
                        t.jsxExpressionContainer(t.numericLiteral(value))
                      )
                    )
                  } else if (value === null) {
                    // why would you ever do this
                    flattenedAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(k),
                        t.jsxExpressionContainer(t.nullLiteral())
                      )
                    )
                  } else {
                    // toString anything else
                    // TODO: is this a bad idea
                    flattenedAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(k),
                        t.jsxExpressionContainer(t.stringLiteral('' + value))
                      )
                    )
                  }
                }
              }
            } catch (e) {
              lastSpreadIndex = flattenedAttributes.push(attr) - 1
            }
          } else {
            flattenedAttributes.push(attr)
          }
        })

        node.attributes = flattenedAttributes

        const staticTernaries: Ternary[] = []
        const _isSingleSpread =
          flattenedAttributes.findIndex((x) => t.isJSXSpreadAttribute(x)) ===
          lastSpreadIndex
        let simpleSpreadIdentifier: t.Identifier | null = null
        const isSingleSimpleSpread =
          _isSingleSpread &&
          flattenedAttributes.some((x) => {
            if (t.isJSXSpreadAttribute(x) && t.isIdentifier(x.argument)) {
              simpleSpreadIdentifier = x.argument
              return true
            }
          })

        let viewStyles: ViewStyle = {}
        let inlinePropCount = 0

        if (shouldPrintDebug) {
          console.log(
            'attribute overview:',
            node.attributes.map((attr) => {
              return 'name' in attr
                ? attr.name.name
                : 'name' in attr.argument
                ? `spread-${attr.argument.name}`
                : `unknown-${attr.type}`
            })
          )
        }

        node.attributes = node.attributes.filter((attribute, idx) => {
          if (
            t.isJSXSpreadAttribute(attribute) ||
            // keep the weirdos
            !attribute.name ||
            // filter out JSXIdentifiers
            typeof attribute.name.name !== 'string' ||
            // haven't hit the last spread operator (we can optimize single simple spreads still)
            (idx < lastSpreadIndex && !isSingleSimpleSpread)
          ) {
            if (shouldPrintDebug) {
              console.log('attr inline via non normal attr')
            }
            inlinePropCount++
            return true
          }

          let name = attribute.name.name
          let value: any = t.isJSXExpressionContainer(attribute?.value)
            ? attribute.value.expression
            : attribute.value

          if (shouldPrintDebug) {
            console.log('attr', { name, inlinePropCount })
          }

          // value == null means boolean (true)
          const isBoolean = value == null
          const isBooleanTruthy =
            isBoolean || (t.isBooleanLiteral(value) && value.value === true)

          // handle expanded attributes if boolean=true
          if (isBooleanTruthy) {
            const expandedAttr =
              component.staticConfig?.styleExpansionProps?.[name]
            if (expandedAttr) {
              Object.assign(viewStyles, expandedAttr)
              return false
            }
          }

          if (isBoolean) {
            inlinePropCount++
            return true
          }

          // if one or more spread operators are present and we haven't hit the last one yet, the prop stays inline
          const hasntHitLastSpread =
            lastSpreadIndex > -1 && idx <= lastSpreadIndex
          if (
            hasntHitLastSpread &&
            // unless we have a single simple spread, we can handle that
            !isSingleSimpleSpread
          ) {
            inlinePropCount++
            return true
          }
          // pass ref, key, and style props through untouched
          if (UNTOUCHED_PROPS[name]) {
            return true
          }

          if (name === 'ref') {
            inlinePropCount++
            return true
          }

          if (!isStaticAttributeName(name)) {
            inlinePropCount++
            return true
          }

          let isDynamic = false
          // if value can be evaluated, extract it and filter it out
          try {
            viewStyles[name] = attemptEval(value)
            return false
          } catch (err) {
            isDynamic = true
            if (process.env.DEBUG === '2') {
              console.log('err evaluating', err)
            }
          }

          if (!isDynamic) {
            inlinePropCount++
            return
          }

          if (t.isConditionalExpression(value)) {
            // if both sides of the ternary can be evaluated, extract them
            try {
              const consequent = attemptEval(value.consequent)
              const alternate = attemptEval(value.alternate)
              staticTernaries.push({
                alternate,
                consequent,
                name,
                test: value.test,
              })
              // mark the prop as extracted
              viewStyles[name] = null
              return false
            } catch (e) {
              //
            }
          } else if (t.isLogicalExpression(value)) {
            // convert a simple logical expression to a ternary with a null alternate
            if (value.operator === '&&') {
              try {
                const consequent = attemptEval(value.right)
                staticTernaries.push({
                  alternate: null,
                  consequent,
                  name,
                  test: value.left,
                })
                viewStyles[name] = null
                return false
              } catch (e) {
                //
              }
            }
          }

          if (shouldPrintDebug) {
            console.log('inline prop via no match', name, value.type)
          }

          // if we've made it this far, the prop stays inline
          inlinePropCount++
          return true
        })

        if (shouldPrintDebug) {
          console.log(`\nwe parsed:
name: ${node.name.name}
inlinePropCount: ${inlinePropCount}
domNode: ${domNode}
          `)
        }

        let classNamePropValue: t.Expression | null = null
        const classNamePropIndex = node.attributes.findIndex(
          (attr) =>
            !t.isJSXSpreadAttribute(attr) &&
            attr.name &&
            attr.name.name === 'className'
        )
        if (classNamePropIndex > -1) {
          classNamePropValue = getPropValueFromAttributes(
            'className',
            node.attributes
          )
          node.attributes.splice(classNamePropIndex, 1)
        }

        // if all style props have been extracted, gloss component can be
        // converted to a div or the specified component
        if (inlinePropCount === 0) {
          if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
            // add name so we can debug it more easily
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('data-is'),
                t.stringLiteral(node.name.name)
              )
            )
          }
          // since were removing down to div, we need to push the default styles onto this classname
          const defaultStyle = component.staticConfig?.defaultStyle ?? {}
          viewStyles = {
            ...defaultStyle,
            ...viewStyles,
          }
          // change to div
          node.name.name = domNode
        }

        // STORE ALL CLASSES => STYLES here
        // this is used to export
        const stylesByClassName: ClassNameToStyleObj = {}

        if (inlinePropCount) {
          if (lastSpreadIndex > -1) {
            if (!isSingleSimpleSpread) {
              // only in case where we dont have a single simple spread
              // if only some style props were extracted AND additional props are spread onto the component,
              // add the props back with null values to prevent spread props from incorrectly overwriting the extracted prop value
              Object.keys(viewStyles).forEach((attr) => {
                node.attributes.push(
                  t.jsxAttribute(
                    t.jsxIdentifier(attr),
                    t.jsxExpressionContainer(t.nullLiteral())
                  )
                )
              })
            }
          }
        }

        if (traversePath.node.closingElement) {
          // this seems strange
          if (t.isJSXMemberExpression(traversePath.node.closingElement.name)) {
            return
          }
          traversePath.node.closingElement.name.name = node.name.name
        }

        const classNameObjects: ClassNameObject[] = []
        if (classNamePropValue) {
          try {
            const evaluatedValue = attemptEval(classNamePropValue)
            classNameObjects.push(t.stringLiteral(evaluatedValue))
          } catch (e) {
            classNameObjects.push(classNamePropValue)
          }
        }

        let classNamePropValueForReals = buildClassNamePropValue(
          classNameObjects
        )

        // for simple spread, we need to have it add in the spread className if exists
        if (isSingleSimpleSpread && simpleSpreadIdentifier) {
          classNamePropValueForReals = t.binaryExpression(
            '+',
            classNamePropValueForReals ?? t.stringLiteral(''),
            t.binaryExpression(
              '+',
              t.stringLiteral(' '),
              t.logicalExpression(
                '||',
                t.memberExpression(
                  simpleSpreadIdentifier,
                  t.identifier('className')
                ),
                t.stringLiteral('')
              )
            )
          )
        }

        // get extracted classNames
        const classNames: string[] = []
        const hasViewStyle = Object.keys(viewStyles).length > 0
        if (hasViewStyle) {
          const styles = getStylesAtomic(viewStyles)
          for (const style of styles) {
            stylesByClassName[style.identifier] = style
            classNames.push(style.identifier)
          }
        }

        let ternaries: TernaryRecord[] = []
        if (staticTernaries.length > 0) {
          const ternaryObj = extractStaticTernaries(
            staticTernaries,
            cacheObject,
            viewStyles
          )
          // ternaryObj is null if all of the extracted ternaries have falsey consequents and alternates
          if (ternaryObj !== null) {
            // add extracted styles by className to existing object
            Object.assign(stylesByClassName, ternaryObj.stylesByClassName)
            ternaries = ternaryObj.ternaryExpression
          }
        }

        if (ternaries.length) {
          if (classNamePropValueForReals) {
            // this will be passed to a <View /> where rnw can de-dupe conflicting classnames
            classNamePropValueForReals = buildClassNamePropValue(
              ternaries.map((x, i) =>
                t.binaryExpression(
                  '+',
                  getTernaryExpression(viewStyles, stylesByClassName, x, i),
                  classNamePropValueForReals!
                )
              )
            )
          } else {
            // but if no spread/className prop, we optimize
            classNamePropValueForReals = buildClassNamePropValue(
              ternaries.map((x, i) =>
                getTernaryExpression(viewStyles, stylesByClassName, x, i)
              )
            )
          }
        } else {
          if (classNames.length) {
            const classNameProp = t.stringLiteral(classNames.join(' '))
            if (classNamePropValueForReals) {
              classNamePropValueForReals = buildClassNamePropValue([
                classNamePropValueForReals,
                classNameProp,
              ])
            } else {
              classNamePropValueForReals = classNameProp
            }
          }
        }

        if (classNamePropValueForReals) {
          if (t.isStringLiteral(classNamePropValueForReals)) {
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('className'),
                t.stringLiteral(classNamePropValueForReals.value)
              )
            )
          } else {
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('className'),
                t.jsxExpressionContainer(classNamePropValueForReals)
              )
            )
          }
        }

        const lineNumbers =
          node.loc &&
          node.loc.start.line +
            (node.loc.start.line !== node.loc.end.line
              ? `-${node.loc.end.line}`
              : '')

        const comment = util.format(
          '/* %s:%s (%s) */',
          sourceFileName.replace(process.cwd(), '.'),
          lineNumbers,
          originalNodeName
        )

        for (const className in stylesByClassName) {
          if (cssMap.has(className)) {
            if (comment) {
              const val = cssMap.get(className)!
              val.commentTexts.push(comment)
              cssMap.set(className, val)
            }
          } else {
            if (stylesByClassName[className]) {
              const { rules } = stylesByClassName[className]
              if (rules.length > 1) {
                console.log(rules)
                throw new Error(`huh?`)
              }
              if (rules.length) {
                cssMap.set(className, {
                  css: rules[0],
                  commentTexts: [comment],
                })
              }
            }
          }
        }
      },
      exit(traversePath: TraversePath<t.JSXElement>) {
        if (traversePath._complexComponentProp) {
          if (t.isJSXElement(traversePath.parentPath)) {
            // bump
            traversePath.parentPath._complexComponentProp = [].concat(
              traversePath.parentPath._complexComponentProp || [],
              traversePath._complexComponentProp
            )
          } else {
            // find nearest Statement
            let statementPath = traversePath
            do {
              statementPath = statementPath.parentPath
            } while (!t.isStatement(statementPath))

            invariant(
              t.isStatement(statementPath),
              'Could not find a statement'
            )

            const decs = t.variableDeclaration(
              'var',
              [].concat(traversePath._complexComponentProp)
            )

            statementPath.insertBefore(decs)
          }
          traversePath._complexComponentProp = null
        }
      },
    },
  })

  const css = Array.from(cssMap.values())
    .map((v) => v.commentTexts.map((txt) => `${txt}\n`).join('') + v.css)
    .join(' ')

  // we didnt find anything
  if (css === '') {
    return {
      ast,
      css: '',
      cssFileName: null,
      js: src,
      map: null,
    }
  }

  const extName = path.extname(sourceFileName)
  const baseName = path.basename(sourceFileName, extName)
  const cssRelativeFileName = `./${baseName}${GLOSS_CSS_FILE}`
  const cssFileName = path.join(sourceDir, cssRelativeFileName)

  if (css !== '') {
    ast.program.body.unshift(
      t.importDeclaration([], t.stringLiteral(cssRelativeFileName))
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
    console.log('output >> ', result.code)
    console.log('output css >> ', css)
  }

  return {
    ast,
    css,
    cssFileName,
    js: result.code,
    map: result.map,
  }
}

function buildClassNamePropValue(classNameObjects: ClassNameObject[]) {
  return classNameObjects.reduce<t.Expression | null>((acc, val) => {
    if (acc == null) {
      if (
        // pass conditional expressions through
        t.isConditionalExpression(val) ||
        // pass non-null literals through
        t.isStringLiteral(val) ||
        t.isNumericLiteral(val)
      ) {
        return val
      }
      return t.logicalExpression('||', val, t.stringLiteral(''))
    }

    let inner: t.Expression
    if (t.isStringLiteral(val)) {
      if (t.isStringLiteral(acc)) {
        // join adjacent string literals
        return t.stringLiteral(`${acc.value} ${val.value}`)
      }
      inner = t.stringLiteral(` ${val.value}`)
    } else if (t.isLiteral(val)) {
      inner = t.binaryExpression('+', t.stringLiteral(' '), val)
    } else if (t.isConditionalExpression(val) || t.isBinaryExpression(val)) {
      if (t.isStringLiteral(acc)) {
        return t.binaryExpression('+', t.stringLiteral(`${acc.value} `), val)
      }
      inner = t.binaryExpression('+', t.stringLiteral(' '), val)
    } else if (t.isIdentifier(val) || t.isMemberExpression(val)) {
      // identifiers and member expressions make for reasonable ternaries
      inner = t.conditionalExpression(
        val,
        t.binaryExpression('+', t.stringLiteral(' '), val),
        t.stringLiteral('')
      )
    } else {
      if (t.isStringLiteral(acc)) {
        return t.binaryExpression(
          '+',
          t.stringLiteral(`${acc.value} `),
          t.logicalExpression('||', val, t.stringLiteral(''))
        )
      }
      // use a logical expression for more complex prop values
      inner = t.binaryExpression(
        '+',
        t.stringLiteral(' '),
        t.logicalExpression('||', val, t.stringLiteral(''))
      )
    }
    return t.binaryExpression('+', acc, inner)
  }, null)
}

function getTernaryExpression(
  baseViewStyles: ViewStyle,
  stylesByClassName: Object,
  { test, consequentStyles, alternateStyles }: TernaryRecord,
  idx: number
) {
  const consInfo = getStylesAtomic({ ...baseViewStyles, ...consequentStyles })
  const altInfo = getStylesAtomic({ ...baseViewStyles, ...alternateStyles })

  if (consInfo.length) {
    for (const style of consInfo) {
      stylesByClassName[style.identifier] = style
    }
  }
  if (altInfo.length) {
    for (const style of altInfo) {
      stylesByClassName[style.identifier] = style
    }
  }

  const consequentClassName = consInfo.map((x) => x.identifier).join(' ')
  const alternateClassName = altInfo.map((x) => x.identifier).join(' ')

  if (consInfo.length && altInfo.length) {
    if (idx > 0) {
      // if it's not the first ternary, add a leading space
      return t.binaryExpression(
        '+',
        t.stringLiteral(' '),
        t.conditionalExpression(
          test,
          t.stringLiteral(consequentClassName),
          t.stringLiteral(alternateClassName)
        )
      )
    } else {
      return t.conditionalExpression(
        test,
        t.stringLiteral(consequentClassName),
        t.stringLiteral(alternateClassName)
      )
    }
  } else {
    // if only one className is present, put the padding space inside the ternary
    return t.conditionalExpression(
      test,
      t.stringLiteral(
        (idx > 0 && consequentClassName ? ' ' : '') + consequentClassName
      ),
      t.stringLiteral(
        (idx > 0 && alternateClassName ? ' ' : '') + alternateClassName
      )
    )
  }
}
