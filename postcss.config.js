module.exports = ctx => ({
    map: ctx.env === 'development' ? ctx.options.map : false,
    plugins: {
        'postcss-preset-env': {
            stage: 4,
            features: {
                'nesting-rules':true
            }
        },
        'cssnano' : {},   
    }
});