import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const babelOptions = {
  exclude: 'node_modules/**',
  presets: [['es2015', { modules: false }], 'stage-0'],
  babelrc: false
};

const dest = {
  amd: `dist/amd/i18nextAsyncStorageBackend${compress ? '.min' : ''}.js`,
  umd: `dist/umd/i18nextAsyncStorageBackend${compress ? '.min' : ''}.js`,
  iife: `dist/iife/i18nextAsyncStorageBackend${compress ? '.min' : ''}.js`
}[format];

export default {
  entry: 'src/index.js',
  format,
  plugins: [
    babel(babelOptions),
    nodeResolve({ jsnext: true }),
    peerDepsExternal(),
  ].concat(compress ? uglify() : []),
  moduleName: 'i18nextAsyncStorageBackend',
  // moduleId: 'i18nextAsyncStorageCache',
  dest
};
