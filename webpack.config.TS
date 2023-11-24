import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import { Configuration, EnvironmentPlugin } from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const envs = {
  LAST_COMPILED: new Date().toLocaleString(),
};

const config: Configuration = {
  entry  : path.join(__dirname, 'src/index.ts'),
  output : {
    path     : path.join(__dirname, 'build'),
    filename : 'suma.js',
  },
  mode      : 'production',
  target    : 'node',
  externals : [ nodeExternals() as any ],
  resolve   : {
    plugins    : [ new TsconfigPathsPlugin() as any ],
    extensions : [ '.ts' ],
  },
  plugins: [
    new EnvironmentPlugin(envs),
    new CopyPlugin({
      patterns: [ { from: 'package.json', to: '.' } ],
    }),
  ],
  module: {
    rules: [
      {
        test    : /\.ts$/,
        include : /src/,
        use     : [ { loader: 'ts-loader' } ],
      },
    ],
  },
};

export default config;