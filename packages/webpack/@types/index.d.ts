declare module "webpack.config" {
    import { CreateWebpackConfig } from '@dish/server';
    import Webpack from 'webpack';
    export function createWebpackConfig({ entry, env, target, cwd, babelInclude, snackOptions, disableHot, resolve, polyFillPath, htmlOptions, defineOptions, noMinify, }: CreateWebpackConfig): Webpack.Configuration;
}
declare module "@dish/webpack" {
    import { createWebpackConfig } from "webpack.config";
    export { createWebpackConfig } from "webpack.config";
    export default createWebpackConfig;
}
