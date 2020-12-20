const express = require("express");
const helmet = require("helmet");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  //PRODUCTION ONLY: Required for first https connection on AppEngine
  if (process.env.NODE_ENV === "production") server.enable("trust proxy");

  server.all("*", (req, res) => {
    //PRODUCTION ONLY: Redirect to https and www if not present in prod
    if (process.env.NODE_ENV === "production") {
      let containsWWW = req.headers.host.match(/^www\..*/i);
      if (req.secure && containsWWW) return handle(req, res);
      else{
        let prefix = containsWWW ? "https://" : "https://www.";
        let url = prefix + req.headers.host + req.url;
        return res.redirect(301, url);
      } 
    }

    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
