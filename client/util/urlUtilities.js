import Router from "next/router";

export default class UrlUtilities {
  static getFullPathIsomorphic(ctx) {
    let fullUrl;
    if (ctx.req) {
      // Server side rendering
      fullUrl = ctx.req.protocol + "://" + ctx.req.get("host") + ctx.req.originalUrl;
    } else {
      // Client side rendering
      fullUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + ctx.asPath;
    }
    return fullUrl;
  }
}
