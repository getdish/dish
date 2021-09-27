import path from 'path'

export const externalizeModules: any = ({ context, request }, callback) => {
  if (request === './cjs/react.development.js') {
    return callback(undefined, 'react')
  }
  if (request === './cjs/react-dom.development.js') {
    return callback(undefined, 'react-dom')
  }
  if (context.includes('node_modules')) {
    if (context.includes('react-native/')) {
      context = context.replace('react-native/', 'react-native-web/')
    }
    if (context.includes('react-native-web') && request[0] === '.') {
      const out = path
        .resolve(path.join(context, request))
        .replace(/.*node_modules\/react-native-web\//, '')
      return callback(undefined, 'commonjs ' + `react-native-web/${out}`)
    }
    // if (request[0] !== '.') {
    //   return callback(undefined, 'commonjs ' + request)
    // }
  }
  callback()
}
