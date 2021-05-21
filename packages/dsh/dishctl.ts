// import sh from '@dish/dsh'

// function yaml_parse(str: string) {
//   return str.split('\n').reduce((res, line) => {
//     const i = line.indexOf(':')
//     const name = line.slice(0, i)
//     const val = line.slice(i + 1).trim()
//     res[name] = val
//     return res
//   }, {})
// }

// function get_yaml(file: string) {
//   return yaml_parse(sh.$cat(file))
// }

// function get_env(type = 'production') {
//   return get_yaml(`.env.${type}`)
// }

// function dish_registry_auth() {
//   sh.exec(`flyctl auth docker`, {
//     env: get_env(),
//     verbose: true,
//   })
// }

// function deploy_all() {
//   dish_registry_auth()
// }

// const cmdPos = process.argv.indexOf('dish.ts')
// const [fn, ...args] = process.argv.slice(cmdPos + 1)

// if (!fn) {
//   console.log('No function given')
// } else {
//   const argsCall = args.length ? `...${args}` : ''
//   const cmd = `${fn}(${argsCall})`
//   console.log('run: ', cmd)
//   eval(cmd)
// }
