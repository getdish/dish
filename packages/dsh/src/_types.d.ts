/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/dsh" {
    import * as sh from "shelljs";
    export { exit } from "shelljs";
    type CmdOptions = {
        env?: {
            [key: string]: any;
        };
        verbose?: boolean;
    };
    export const cat: (x: TemplateStringsArray | string) => sh.ShellString;
    export const $cat: (x: TemplateStringsArray | string) => sh.ShellString;
    export const exec: (str: TemplateStringsArray | string, opts: CmdOptions) => any;
    export const echo: (str: TemplateStringsArray) => sh.ShellString;
    export const cd: (str: TemplateStringsArray) => sh.ShellString;
    export const ls: (str: TemplateStringsArray) => sh.ShellArray;
    export const which: (str: TemplateStringsArray) => sh.ShellString;
    export const rm: (str: TemplateStringsArray) => sh.ShellString;
    export const sed: (str: TemplateStringsArray) => sh.ShellString;
    export const mkdir: (str: TemplateStringsArray) => sh.ShellString;
}
