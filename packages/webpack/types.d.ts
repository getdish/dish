declare module "@dish/webpack" {
    import { CreateWebpackConfig } from "@dish/server";
    import Webpack from "webpack";
    export function createWebpackConfig({ entry, env, target, cwd, babelInclude, snackOptions, disableHot, resolve, polyFillPath, htmlOptions, resetCache, defineOptions, noMinify, }: CreateWebpackConfig): Webpack.Configuration;
}

declare module "@dish/webpack" {
    export default createWebpackConfig;
}
//# sourceMappingURL=types.d.ts.map
