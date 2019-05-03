module.exports = env => {
    const isDev = env === 'dev';
    return {
        mode: isDev ? "development" : "production",
        entry: "./src/index.js",
        devtool: "sourcemap",
        output: {
            path: __dirname + "/dist",
            filename: `string-stream${isDev ? '' : '.min'}.js`
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader'
                }
            ]
        }
    }; 
};