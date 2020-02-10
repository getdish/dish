module.exports = {
    webpack: (config, { defaultLoaders }) => {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            // Transform all direct `react-native` imports to `react-native-web`
            'react-native$': 'react-native-web',
        }
        config.module.rules = config.module.rules.concat([{
            test: /\.s?css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true, // allow source mapping
                        // Need to disable to allow global styles applicable in `map`
                        // modules: true, // allow module imports (ex: import styles from 'example.scss')
                    },
                },
                'sass-loader',
            ]
        }])
        config.resolve.extensions.push('.web.js', '.web.ts', '.web.tsx')
        return config
    },
}