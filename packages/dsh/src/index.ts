import * as sh from 'shelljs'
import { ShellString } from 'shelljs'

export { exit } from 'shelljs'

const logCmd = (cmd: ShellString) => {
  if (cmd.stdout) {
    console.log(cmd.stdout)
  }
  if (cmd.stderr) {
    console.error(cmd.stderr)
  }
  return cmd
}

type CmdOptions = {
  env?: { [key: string]: any }
  verbose?: boolean
}

const runWithEnv = (cmd: Function, opts: CmdOptions) => {
  if (opts.env) {
    const previous = { ...sh.env }
    Object.assign(sh.env, opts.env)
    const res = cmd()
    for (const key in opts.env) {
      sh.env[key] = previous[key]
    }
    return res
  }
}

const verbose = (cmd: string, opts: CmdOptions) => {
  if (opts.verbose) {
    console.log(cmd)
  }
}

const catBase = (str: TemplateStringsArray | string) =>
  typeof str === 'string' ? sh.cat(str) : sh.cat(...str)
export const cat = (x: TemplateStringsArray | string) => logCmd(catBase(x))
export const $cat = (x: TemplateStringsArray | string) => catBase(x)

export const exec = (str: TemplateStringsArray | string, opts: CmdOptions) => {
  const arg = typeof str === 'string' ? str : str[0]
  verbose(arg, opts)
  return runWithEnv(() => sh.exec(arg), opts)
}

export const echo = (str: TemplateStringsArray) => sh.echo(...str)
export const cd = (str: TemplateStringsArray) => sh.cd(str.join(' '))
export const ls = (str: TemplateStringsArray) => sh.ls(str.join(' '))
export const which = (str: TemplateStringsArray) => sh.which(str[0])
export const rm = (str: TemplateStringsArray) => sh.rm(...str)
export const sed = (str: TemplateStringsArray) => sh.sed(str[0], str[1], ...str.slice(2))

export const mkdir = (str: TemplateStringsArray) => sh.mkdir(...str)
