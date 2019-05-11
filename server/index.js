const Vue = require("vue");
const server = require("express")();
const { createRenderer } = require("vue-server-renderer");

const renderer = createRenderer({
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

server.get("*", (req, res) => {
  const app = new Vue({
    data: () => ({ count: 0 }),
    computed: {
      url: () => req.url
    },
    methods: {
      inc() {
        this.count++;
      },
      dec() {
        this.count--;
      }
    },
    template: `
      <div>
        <div>The visited URL is: {{ url }}</div>
        <p><span>Count: {{ count }}</span></p>
        <button @click="inc()">+</button>
        <button @click="dec()">-</button>
      </div>`
  });
  app.inc();

  const context = {
    title: "hello ssr",
    meta: '<meta charset="UTF-8">'
  };

  renderer.renderToString(app, context, (err, html) => {
    if (err) {
      res.status(500).end("Internal Server Error");
      return;
    }
    res.end(html);
  });
});

const port = 8888;
server.listen(port);

/* eslint-disable no-console */
console.log(`port number is ${port}`);
