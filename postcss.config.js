module.exports = ({ options, env }) => ({
  map: env === 'development' ? options.map : false,
  plugins: {
    'postcss-preset-env': {
      stage: 4,
    },
  },
});
