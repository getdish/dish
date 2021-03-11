import sh from '@dish/dsh'

function yaml_parse(str: string) {
  return str.split('\n').reduce((res, line) => {
    const i = line.indexOf(':')
    const name = line.slice(0, i)
    const val = line.slice(i + 1).trim()
    res[name] = val
    return res
  }, {})
}

function get_yaml(file: string) {
  return yaml_parse(sh.$cat(file))
}

function get_env(type = 'production') {
  return get_yaml(`env.enc.${type}.yaml`)
}

function dish_registry_auth() {
  sh.exec(`flyctl auth docker`, {
    env: get_env(),
    verbose: true,
  })
}

function deploy_all() {
  dish_registry_auth()
  // set -e
  // export_env
  // where=${1:-registry}
  // # make them all background so we can handle them the same
  // echo "deploying apps via $where"
  // deploy "$where" redis | sed -e 's/^/redis: /;' &
  // # deploy "$where" db | sed -e 's/^/db: /;' &
  // wait
  // deploy "$where" hooks | sed -e 's/^/hooks: /;' &
  // wait
  // # depends on postgres
  // # depends on hooks
  // deploy "$where" hasura | sed -e 's/^/hasura: /;' &
  // wait
  //  # depends on hasura
  // deploy "$where" tileserver | sed -e 's/^/tileserver: /;' &
  // deploy "$where" timescale | sed -e 's/^/timescale: /;' &
  // wait
  // deploy "$where" pg-admin | sed -e 's/^/pg-admin: /;' &
  // deploy "$where" proxy | sed -e 's/^/proxy: /;' &
  // deploy "$where" app | sed -e 's/^/app: /;' &
  // deploy "$where" search | sed -e 's/^/search: /;' &
  // deploy "$where" worker | sed -e 's/^/worker: /;' &
  // deploy "$where" image-quality | sed -e 's/^/image-quality: /;' &
  // deploy "$where" image-proxy | sed -e 's/^/image-proxy: /;' &
  // deploy "$where" bert | sed -e 's/^/bert: /;' &
  // deploy "$where" cron | sed -e 's/^/cron: /;' &
  // wait
  // # depends on redis
  // deploy "$where" hooks | sed -e 's/^/hooks: /;' &
  // wait
}

const cmdPos = process.argv.indexOf('dishctl.ts')
const [fn, ...args] = process.argv.slice(cmdPos + 1)

if (!fn) {
  console.log('No function given')
} else {
  const argsCall = args.length ? `...${args}` : ''
  const cmd = `${fn}(${argsCall})`
  console.log('run: ', cmd)
  eval(cmd)
}
