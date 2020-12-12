<h1 align="center">
  <img margin="auto" width="612px" src="https://raw.githubusercontent.com/natew/snackui/master/snackui.jpg" alt="SnackUI">
  <br>
  SnackUI
  <br>
</h1>

<h4 align="center">A fast UI kit for React Native (+ web) with SwiftUI stacks.</h4>

<p align="center">
  <a href="#setup">Setup</a> •
  <a href="#example">Example</a> •
  <a href="#issues">Issues</a> •
  <a href="#license">License</a>
</p>

SnackUI is a UI kit for react native and react native web that builds on the ideas of [JSXStyle](https://github.com/jsxstyle/jsxstyle) and SwiftUI. It's a great way to build cross platform app UI's on React that scale well - with smaller bundle sizes and faster rendering performance than StyleSheet.create() on the web.

SnackUI is light. It doesn't prescribe much beyond providing a few basic views that help you lay things out and providing the optimizing compiler.

## Tradeoffs

#### Pros

- **Nicer base views**: Stacks are easy to learn and use
- **Less up front time**: No more jumping between style/view, no time spent thinking about naming things.
- **Less long term maintenance**: No dead code to clean up, no thinking about merging shared styles.
- **Smaller bundle sizes**: Because everything is extracted to atomic CSS and theres no managing duplicate styles, you ship less JS and lighten your bundle.
- **Faster runtime performance**: Your browser can parse the CSS as it loads the page, view flattening means React trees are far more shallow.
- **Devtools**: Compiler outputs helpful information to DOM

#### Cons

- **More setup**: Need to configure a webpack plugin and babel plugin
- **Is Beta**: Will run into edge cases
- **Testing**: Needs to implement some testing helpers

## Features

SnackUI views flatten all style props onto the base props so there's no separate `style` prop to use, if you want to read reasoning on why, [see why JSXStyle does it](https://github.com/jsxstyle/jsxstyle#why-write-styles-inline-with-jsxstyle), SnackUI has all the same upsides listed there.

SnackUI features:

- **Stack views** with flat, simpler RN TypeScript types
  - VStack, HStack, ZStack
  - inspired by [SwiftUI stack views](https://learnappmaking.com/stacks-vstack-hstack-swiftui-how-to/)
- Optimizing compiler
  - fork of [JSXStyle](https://github.com/jsxstyle/jsxstyle)
  - flattens `<View />` and `<Text />` into `<div />` and `<span />` where possible, increasing render performance.
  - extracts inline styles to highly optimized [atomic CSS](https://css-tricks.com/lets-define-exactly-atomic-css/) stylesheets similar to [Facebook's internal style library](https://twitter.com/Daniel15/status/1160980442041896961).
  - supports imported constant files for compiling shared constants and colors to CSS as well.
  - supports simple conditionals like `color={isLarge ? 'red' : 'blue'}`
  - supports simple spreads like: `<Text {...isLarge && { color: 'red' }} />`
- Pseudo styles
  - supports hoverStyle, pressStyle, and focusStyle
  - normalizes tricky styling between native and web
- Development tools
  - shows component name in DOM elements.
  - add `// debug` to the top of file for detailed optimization info.

## Example

```tsx
import { Text, VStack } from 'snackui'

export function Component() {
  return (
    <VStack
      marginHorizontal={10}
      backgroundColor="red"
      hoverStyle={{ backgroundColor: 'blue' }}
    >
      <Text color="green">Hello world</Text>
    </VStack>
  )
}
```

This will compile on the web to something like this:

```tsx
const _cn1 = 'r-1awozwy r-y47klf r-rs99b7 r-h-1udh08x'
const _cn2 = 'r-4qtqp9 r-1i10wst r-x376lf'
export function Component() {
  return (
    <div className={_cn1}>
      <span className={_cn2}>Hello world</span>
    </div>
  )
}
```

Why is this beneficial? React Native Web's views like `<View />` and `<Text />` are actually not so simple. [Read the source of Text](https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Text/index.js) for example. When you're rendering a large page with many text and view elements that can be statically extracted, using snackui saves React from having to process all of that logic on every render, for every Text and View.

SnackUI has fairly advanced optimizations:


```tsx
import { Text, VStack } from 'snackui'
import { redColor } from './colors'

// this entire component can be extracted:

const height = 10

export function Component(props) {
  return (
    <VStack
      // constant values
      height={height}
      // imported constants (using evaluateImportsWhitelist option)
      color={redColor}
      // inline conditionals
      backgroundColor={props.highlight ? 'red' : 'blue'}
      // spread objects
      {...props.hoverable && {
        hoverStyle: { backgroundColor: 'blue' }
      }}
      // spread conditional objects
      {...props.condition ? {
          hoverStyle: { backgroundColor: 'blue' }
        } : {
          hoverStyle: { backgroundColor: 'red' }
        }
      }
    />
  )
}
```


## Setup

Add snackui to your project:

```bash
yarn add snackui @snackui/static @snackui/babel-plugin
```

You'll likely want to gitignore the outputted style files, though it's not necessary. We originally kept CSS in-memory, but ran into various issues, but would support re-implementing it if anyone knows a cleaner way. In your `.gitignore` add this:

```
*__snack.css
```

### Babel - Native / Simple extraction (experimental)

This is useful for Native apps or if you're not using Webpack.

For a simpler setup you can just add `@snackui/babel-plugin` as a babel plugin to your babel config to get extraction just to StyleSheet.create(). This isn't as performant as going to CSS, but works with anything that supports babel.

You can technically just use the babel plugin, but if you want much better flattening and CSS extraction, read on.

### Webpack - CSS extraction

To extract to CSS, SnackUI supports Webpack for now (v4 and v5). Add the loader to your webpack config after `babel-loader`. Note, **don't use the babel plugin if you are doing this**, you only need the loader for Webpack.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: require.resolve('@snackui/static/loader'),
            options: {
              // use this to add files to be statically evaluated
              // default:
              evaluateImportsWhitelist: ['constants.js', 'colors.js'],
              // exclude files from processing
              // default null
              exclude: /node_modules/,
              // attempts to statically follow variables to compile
              // default true
              evaluateVars: true

            },
          },
        ].filter(Boolean),
      },
    ],
  },
}
```

#### Caveat

react-native-web is currently taking a hard stance against supporting className and removed support for it in v0.14. We've opened an issue, but received pushback. We are going to try and work with them to see if there's a way they can enable a workaround now that we've published SnackUI. You'll have to use `patch-package` to restore className support for now.

- Example [patch for react-native-web experimental](docs/react-native-web+0.0.0-466063b7e.patch) (includes a extra patch for faster Text styles)

## Issues

SnackUI is still early stage. It works well for us, and we've built a fairly large app with it, but it's needs wider testing and a couple more features before it really shines. Upcoming fixes:

- [ ] ZStack has incorrect behavior vs SwiftUI
  - Right now it doesn't position child elements as Absolute positioned

## Roadmap

See [the roadmap](roadmap.md):

- [ ] Themes
- [ ] Media Queries
- [ ] Support <Stack spacing />
- [ ] Support <Input />, <Spacer flex />, <LinearGradient />, maybe <Image />
- [ ] Support a few logical HTML props: onPress, etc

## License

MIT License, see [LICENSE](https://github.com/natew/snackui/blob/master/LICENSE)
