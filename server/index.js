const Vue = require("vue");
const server = require("express")();
const renderer = require("vue-server-renderer").createRenderer();

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

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end("Internal Server Error");
      return;
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `);
  });
});

const port = 8888;
server.listen(port);

/* eslint-disable no-console */
console.log(`port number is ${port}`);
