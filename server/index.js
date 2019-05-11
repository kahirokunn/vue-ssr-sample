const createApp = require("../dist/ssr.umd.min").default;
const Vue = require("vue");
const server = require("express")();
const { createRenderer } = require("vue-server-renderer");

const renderer = createRenderer({
  runInNewContext: false,
  // vue-ssr-outletの部分にhtmlを挿入する
  template: `
    <!DOCTYPE html>
    <html>
      <head>
        <title>{{ title }}</title>
        {{{ meta }}}
      </head>
      <body>
        <!--vue-ssr-outlet-->
      </body>
    </html>`
});

/* eslint-disable no-console */

server.get("*", (req, res) => {
  const context = {
    title: "hello ssr",
    meta: '<meta name="keywords" content="Vue, SSR">',
    url: req.url,
    // window.__INITIAL_STATE__={"counter":3}
    // と、jsonシリアライズした状態で埋め込まれる
    // vuexの単一状態木とかのサーバーからフロントへのデータ引っ越しはこれを利用する
    // 例: store.replaceState(window.__INITIAL_STATE__)
    state: {
      counter: 3
    }
  };

  createApp(context)
    .then(app => {
      renderer.renderToString(app, context, (err, html) => {
        if (err) {
          console.log(req.url, err);
          if (err.code === 404) {
            res.status(404).end("Page not found");
          } else {
            res.status(500).end("Internal Server Error");
          }
        } else {
          res.end(html);
        }
      });
    })
    .catch(err => {
      console.log(req.url, err);
      if (err.code === 404) {
        res.status(404).end("Page not found");
      } else {
        res.status(500).end("Internal Server Error");
      }
    });
});

const port = 8888;
server.listen(port);

/* eslint-disable no-console */
console.log(`port number is ${port}`);
