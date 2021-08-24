import * as babelParser from '@babel/parser'

export const parserOptions: babelParser.ParserOptions = Object.freeze({
  plugins: [
    'asyncGenerators',
    'classProperties',
    'dynamicImport',
    'functionBind',
    'jsx',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'decorators-legacy',
    'typescript',
    'optionalChaining',
    'nullishCoalescingOperator',
    // 'objectRestSpread',
    // 'dynamicImport'
  ],
  sourceType: 'module',
})

const parser = babelParser.parse.bind(babelParser)

export function babelParse(code: string | Buffer): any {
  return parser(code.toString(), parserOptions)
}
