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

import { GLOSS_CSS_FILE } from '../constants'
import { getStylesAtomic } from '../style/getStylesAtomic'
import { stylePropsText, stylePropsView } from '../style/styleProps'
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

// import { resolve } from 'react-native-web/dist/cjs/exports/StyleSheet/styleResolver'

const shouldPrintDebug = !!process.env.DEBUG

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

if (shouldPrintDebug) {
  console.log('validComponents', Object.keys(validComponents))
}

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
  let doesUseValidImport = false

  // Find gloss require in program root
  ast.program.body.forEach((item: t.Node) => {
    if (t.isImportDeclaration(item)) {
      if (
        item.source.value === '@dish/ui' ||
        sourceFileName.includes('/ui/src')
      ) {
        doesImport = true
      }
      if (doesImport) {
        item.specifiers.forEach((specifier) => {
          if (validComponents[specifier.local.name]) {
            doesUseValidImport = true
          }
        })
      }
    }
  })

  // gloss isn't included anywhere, so let's bail
  if (!doesImport || !doesUseValidImport) {
    return {
      ast,
      css: '',
      cssFileName: null,
      js: src,
      map: null,
    }
  }

  if (shouldPrintDebug) {
    console.log('\nSTART', sourceFileName)
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
        const isTextView = originalNodeName.endsWith('Text')
        const styleProps = isTextView ? stylePropsText : stylePropsView
        const domNode = isTextView ? 'span' : 'div'

        if (shouldPrintDebug) {
          console.log('node', originalNodeName, domNode)
        }

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
                return evaluateAstNode(n, evalFn)
              }
            })()

        const attemptEvalSafe = (n: t.Node) => {
          try {
            return attemptEval(n)
          } catch {
            return null
          }
        }

        // STORE *EVERY* { [CLASSNAME]: STYLES } on this (used to generate css later)
        const stylesByClassName: ClassNameToStyleObj = {}
        // stores className objects we build up later into a single className
        const classNameObjects: ClassNameObject[] = []
        // ternaries we can extract, of course
        const staticTernaries: Ternary[] = []

        const addStylesAtomic = (style: any) => {
          console.log('addStylesAtomic', style)
          if (!style) return style
          const res = getStylesAtomic(style)
          res.forEach((x) => {
            stylesByClassName[style.identifier] = x
          })
          return res
        }

        let lastSpreadIndex: number = -1
        const flattenedAttributes: (
          | t.JSXAttribute
          | t.JSXSpreadAttribute
        )[] = []

        const isStyleObject = (obj: t.Node): obj is t.ObjectExpression => {
          return (
            t.isObjectExpression(obj) &&
            !![console.log(obj.properties)] &&
            obj.properties.every(
              (prop) =>
                t.isObjectProperty(prop) && isStaticAttributeName(prop.key.name)
            )
          )
        }

        node.attributes.forEach((attr, index) => {
          if (!t.isJSXSpreadAttribute(attr)) {
            flattenedAttributes.push(attr)
            return
          }

          const name = ''

          // simple spreads of style objects like ternaries

          // <VStack {...isSmall ? { color: 'red } : { color: 'blue }}
          if (t.isConditionalExpression(attr.argument)) {
            const { alternate, consequent, test } = attr.argument
            const aStyle = isStyleObject(alternate)
              ? attemptEvalSafe(alternate)
              : null
            const cStyle = isStyleObject(consequent)
              ? attemptEvalSafe(consequent)
              : null

            if (aStyle || cStyle) {
              staticTernaries.push({
                test,
                alternate: aStyle,
                consequent: cStyle,
              })
              return
            }
          }

          // <VStack {...isSmall && { color: 'red' }}
          if (t.isLogicalExpression(attr.argument)) {
            if (isStyleObject(attr.argument.right)) {
              const spreadStyle = attemptEvalSafe(attr.argument.right)
              if (spreadStyle) {
                const styles = addStylesAtomic(spreadStyle)
                if (styles) {
                  console.log('adding2', styles, spreadStyle)
                  staticTernaries.push({
                    test: (attr.argument as t.LogicalExpression).left,
                    alternate: styles,
                    consequent: null,
                  })
                  return
                }
              }
            }
          }

          // handle all other spreads
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
        })

        node.attributes = flattenedAttributes

        const hasOneEndingSpread =
          flattenedAttributes.findIndex((x) => t.isJSXSpreadAttribute(x)) ===
          lastSpreadIndex
        let simpleSpreadIdentifier: t.Identifier | null = null
        const isSingleSimpleSpread =
          hasOneEndingSpread &&
          flattenedAttributes.some((x) => {
            if (t.isJSXSpreadAttribute(x) && t.isIdentifier(x.argument)) {
              simpleSpreadIdentifier = x.argument
              return true
            }
          })

        let viewStyles: ViewStyle = {}
        let inlinePropCount = 0

        if (shouldPrintDebug) {
          console.log('attr overview:', node.attributes.map(attrGetName))
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
              console.log('attr inline via non normal attr', attribute['name'])
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

          // if value can be evaluated, extract it and filter it out
          try {
            viewStyles[name] = attemptEval(value)
            return false
          } catch (err) {
            if (process.env.DEBUG === '2') {
              console.log('err evaluating', err)
            }
          }

          // if both sides of the ternary can be evaluated, extract them
          if (t.isConditionalExpression(value)) {
            try {
              const aVal = attemptEval(value.alternate)
              const cVal = attemptEval(value.consequent)
              staticTernaries.push({
                alternate: { [name]: aVal },
                consequent: { [name]: cVal },
                test: value.test,
              })
              return false
            } catch {
              //
            }
          }

          // convert a simple logical expression to a ternary with a null alternate
          if (t.isLogicalExpression(value)) {
            if (value.operator === '&&') {
              try {
                const val = attemptEval(value.right)
                staticTernaries.push({
                  alternate: null,
                  consequent: { [name]: val },
                  test: value.left,
                })
                return false
              } catch {
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

        if (inlinePropCount) {
          if (lastSpreadIndex > -1) {
            if (!isSingleSimpleSpread) {
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

        // get extracted classNames
        const classNames: string[] = []
        const hasViewStyle = Object.keys(viewStyles).length > 0
        if (hasViewStyle) {
          const styles = addStylesAtomic(viewStyles)
          if (shouldPrintDebug) {
            console.log('viewStyles', originalNodeName, viewStyles, styles)
          }
          for (const style of styles) {
            classNames.push(style.identifier)
          }
        }

        const ternaries = extractStaticTernaries(staticTernaries, cacheObject)

        if (ternaries?.length) {
          if (classNamePropValueForReals) {
            classNamePropValueForReals = t.binaryExpression(
              '+',
              buildClassNamePropValue(
                ternaries.map((x, i) =>
                  // stupid mutating fn
                  getTernaryExpression(viewStyles, addStylesAtomic, x, i)
                )
              ),
              t.binaryExpression(
                '+',
                t.stringLiteral(' '),
                classNamePropValueForReals!
              )
            )
          } else {
            // but if no spread/className prop, we optimize
            classNamePropValueForReals = buildClassNamePropValue(
              ternaries.map((x, i) =>
                // stupid mutating fn
                getTernaryExpression(viewStyles, addStylesAtomic, x, i)
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

        // for simple spread, we need to have it add in the spread className if exists
        if (
          classNamePropValueForReals &&
          isSingleSimpleSpread &&
          simpleSpreadIdentifier
        ) {
          classNamePropValueForReals = t.binaryExpression(
            '+',
            classNamePropValueForReals,
            t.binaryExpression(
              '+',
              t.stringLiteral(' '),
              t.logicalExpression(
                '||',
                t.logicalExpression(
                  '&&',
                  simpleSpreadIdentifier,
                  t.memberExpression(
                    simpleSpreadIdentifier,
                    t.identifier('className')
                  )
                ),
                t.stringLiteral('')
              )
            )
          )
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
    if (shouldPrintDebug) {
      console.log('nothing extracted!', sourceFileName)
    }
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

// stupid mutating fn (stylesByClassName)
function getTernaryExpression(
  baseViewStyles: ViewStyle,
  addStylesAtomic: Function,
  { test, consequentStyles, alternateStyles }: TernaryRecord,
  idx: number,
  baseClass?: t.Expression
) {
  console.log('consequentStyles', consequentStyles, alternateStyles)
  const consInfo = addStylesAtomic({ ...baseViewStyles, ...consequentStyles })
  const altInfo = addStylesAtomic({ ...baseViewStyles, ...alternateStyles })

  const cCN = consInfo.map((x) => x.identifier).join(' ')
  const aCN = altInfo.map((x) => x.identifier).join(' ')
  const getClassLit = (s: string) => {
    const lit = t.stringLiteral(s)
    return baseClass ? t.binaryExpression('+', lit, baseClass) : lit
  }
  if (consInfo.length && altInfo.length) {
    if (idx > 0) {
      // if it's not the first ternary, add a leading space
      return t.binaryExpression(
        '+',
        t.stringLiteral(' '),
        t.conditionalExpression(test, getClassLit(cCN), getClassLit(aCN))
      )
    } else {
      return t.conditionalExpression(test, getClassLit(cCN), getClassLit(aCN))
    }
  } else {
    // if only one className is present, put the padding space inside the ternary
    return t.conditionalExpression(
      test,
      getClassLit((idx > 0 && cCN ? ' ' : '') + cCN),
      getClassLit((idx > 0 && aCN ? ' ' : '') + aCN)
    )
  }
}

const attrGetName = (attr) => {
  return 'name' in attr
    ? attr.name.name
    : 'name' in attr.argument
    ? `spread-${attr.argument.name}`
    : `unknown-${attr.type}`
}
