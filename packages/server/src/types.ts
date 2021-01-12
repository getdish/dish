export type ServerConfig = {
  rootFolder: string
  env: 'prod' | 'dev'
  inspect?: boolean
  clean?: boolean
  port?: number
  hostname?: string
}
