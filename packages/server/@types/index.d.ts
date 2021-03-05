declare module "cli" {
    import './lib/env';
    export function run(): Promise<void>;
}
declare module "command" {
    import { Command as OclifCommand } from '@oclif/command';
    import Enquirer from 'enquirer';
    export abstract class Command extends OclifCommand {
        protected enquirer: Enquirer<object>;
    }
}
declare module "types" {
    import Webpack, { Configuration } from 'webpack';
    export type ServerConfig = {
        rootDir: string;
        watch: boolean;
        env: 'production' | 'development';
        inspect?: boolean;
        clean?: 'web' | 'legacy' | 'node' | 'all' | false | string;
        port?: number;
        host?: string;
        apiDir?: string | null;
        https?: boolean;
        verbose?: boolean;
        noOptimize?: boolean;
        serial?: boolean;
        resetCache?: boolean;
    };
    export type ServerConfigNormal = Required<ServerConfig> & {
        url: string;
        buildDir: string;
        protocol: string;
        createConfig: (opts: CreateWebpackConfig) => Configuration;
        webpackConfig: Omit<CreateWebpackConfig, 'target'>;
    };
    export type CreateWebpackConfig = {
        entry: string;
        target: 'node' | 'web';
        env: 'development' | 'production';
        cwd?: string;
        babelInclude?: (path: string) => boolean;
        snackOptions: {
            themesFile?: string;
            evaluateVars?: boolean;
            evaluateImportsWhitelist?: string[];
            exclude?: RegExp;
            mediaQueries?: any;
        };
        resolve?: Webpack.ResolveOptions;
        htmlOptions?: Object;
        defineOptions?: Object;
        polyFillPath?: string;
        disableHot?: boolean;
        noMinify?: boolean;
        verbose?: boolean;
    };
    export type File = {
        name: string;
        route: string;
        file: string;
        fileIn: string;
    };
}
declare module "@dish/server" {
    export * from "cli";
    export * from "types";
}
declare module "lib/buildApp" {
    import { Configuration } from 'webpack';
    import { CreateWebpackConfig, ServerConfig } from "types";
    export function buildApp({ webpackConfig, createConfig, watch, clean, serial, }: {
        webpackConfig: Omit<CreateWebpackConfig, 'target'>;
        createConfig: (config: CreateWebpackConfig) => Configuration;
        watch?: boolean;
        clean?: ServerConfig['clean'];
        serial?: boolean;
    }): Promise<void>;
}
declare module "lib/getWebpackConfigBuilder" {
    import { CreateWebpackConfig } from "types";
    export function getWebpackConfigBuilder({ rootDir }: {
        rootDir: string;
    }): (config: CreateWebpackConfig) => any;
}
declare module "commands/build" {
    import { Command, flags } from '@oclif/command';
    export class Build extends Command {
        static description: string;
        static aliases: string[];
        static flags: {
            help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
            clean: flags.IOptionFlag<string | undefined>;
            serial: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            "no-optimize": import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        };
        run(): Promise<void>;
    }
}
declare module "lib/createWebServer" {
    import { ServerConfigNormal } from "types";
    export function createWebServer(app: any, serverConfig: ServerConfigNormal): Promise<void>;
}
declare module "lib/createServer" {
    import { ServerConfig } from "types";
    export function createServer(serverConf: ServerConfig): Promise<void>;
}
declare module "commands/serve" {
    import { Command, flags } from '@oclif/command';
    export class Start extends Command {
        static description: string;
        static aliases: string[];
        static flags: {
            help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
            'no-api': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            port: import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
            host: flags.IOptionFlag<string | undefined>;
            clean: flags.IOptionFlag<string>;
            https: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            verbose: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        };
        run(): Promise<void>;
    }
}
declare module "commands/start" {
    import { Command, flags } from '@oclif/command';
    export class Start extends Command {
        static description: string;
        static aliases: string[];
        static flags: {
            help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
            prod: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            ssr: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            'no-api': import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
            port: import("@oclif/parser/lib/flags").IOptionFlag<number | undefined>;
            host: flags.IOptionFlag<string | undefined>;
            inspect: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            clean: flags.IOptionFlag<string>;
            https: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            serial: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            "no-optimize": import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
            "reset-cache": import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        };
        run(): Promise<void>;
    }
}
declare module "lib/createApiServer" {
    import { ServerConfigNormal } from "types";
    export function createApiServer(app: any, config: ServerConfigNormal): Promise<void>;
}
declare module "lib/createApiServer.worker" { }
declare module "lib/createWebServerDev" {
    import webpack from 'webpack';
    import { ServerConfigNormal } from "types";
    export function createWebServerDev(app: any, { webpackConfig, rootDir }: ServerConfigNormal): webpack.Compiler;
}
declare module "lib/createWebServerDev.worker" { }
declare module "lib/createWebServerProd.worker" { }
declare module "lib/shimBrowser" {
    import { JSDOM } from 'jsdom';
    export function shimBrowser(): JSDOM;
}
declare module "lib/typescriptOptions" {
    import { CompilerOptions } from 'typescript';
    export const typescriptOptions: CompilerOptions;
}
