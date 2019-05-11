const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const baseConfig = require("./webpack.base.config.js");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");

module.exports = merge(baseConfig, {
  // アプリケーションサーバのエントリファイルへのエントリポイント
  entry: "/path/to/entry-server.js",

  // これにより、webpack は Node に適した方法で動的なインポートを処理でき、
  // Vue コンポーネントをコンパイルするときにサーバー指向のコードを出力するよう
  // `vue-loader`に指示する
  target: "node",

  // バンドルレンダラーのソースマップのサポート
  devtool: "source-map",

  // Node スタイルのエクスポートを使用するようにサーバーバンドルに指示する
  output: {
    libraryTarget: "commonjs2"
  },

  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // アプリケーションの依存関係を外部化する
  // これにより、サーバーのビルドが大幅に高速化され、より小さなバンドルファイルが生成される
  externals: nodeExternals({
    // webpack で処理する必要がある依存関係を外部化しない
    // ここに例として、生の *.vueファイルのようなファイルタイプを追加できる
    // `グローバル` (例 ポリフィル) を変更する deps もホワイトリストに登録する必要がある
    whitelist: /\.css$/
  }),

  // これはサーバービルドの出力全体を
  // 1つの JSON ファイルに変換するプラグイン。
  // デフォルトのファイル名は `vue-ssr-server-bundle.json`
  plugins: [new VueSSRServerPlugin()]
});
