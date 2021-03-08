/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/webpack" {
    import { CreateWebpackConfig } from "@dish/server";
    import Webpack from "webpack";
    export function createWebpackConfig({ entry, env, target, cwd, babelInclude, snackOptions, disableHot, resolve, polyFillPath, htmlOptions, defineOptions, noMinify, }: CreateWebpackConfig): Webpack.Configuration;
}

declare module "@dish/webpack" {
    export default createWebpackConfig;
}
