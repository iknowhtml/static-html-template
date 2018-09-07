import paths from './webpack/paths';

import partial from './webpack/partials/partial';

import { postCSS } from './webpack/partials/modules';
import { devServer } from './webpack/partials/configurations';
import {htmlWebpack, hotModuleReplacement} from './webpack/partials/plugins';

import webpackConfiguration from './webpack/webpackConfiguration';

let server;

function reloadHtmlPlugin() {
  const cache = {};
  const plugin = {name: 'CustomHtmlReloadPlugin'};
  this.hooks.compilation.tap(plugin, compilation => {
    compilation.hooks.htmlWebpackPluginAfterEmit.tap(plugin, data => {
      const orig = cache[data.outputName];
      const html = data.html.source();
      // plugin seems to emit on any unrelated change?
      if (orig && orig !== html) {
        server.sockWrite(server.sockets, 'content-changed');
      };
      cache[data.outputName] = html
    });
  });
};

const reloadHtml = (config) => partial({plugin: reloadHtmlPlugin}, config);

const base = {
  entry: {index: `${paths.src}/index.js`},
  output: {
    path: paths.dist,
    filename: '[name].js'
  },
};

export default ({ NODE_ENV }) => {
  const common = [
    htmlWebpack({
      title: "CSS Playground",
      template: `${paths.src}/index.ejs`,
      NODE_ENV
    }), 
    postCSS({ filename: 'style.css', }),
  ];

  const development = [
    hotModuleReplacement(),
    reloadHtml,
    devServer({
      contentBase: paths.dist,
      watchContentBase: true,
      before(_, s) {
        server = s;
      }
    }),
  ];

  const production = [];

  const config =
    NODE_ENV === 'production'
      ? [...common, ...production]
      : [...common, ...development];


  return webpackConfiguration(base, config);
};
