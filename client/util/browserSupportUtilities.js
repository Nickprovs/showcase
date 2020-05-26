const serverSideIsBrowserUnsupported = (userAgent) => {
  return !isInternetExplorer(userAgent);
};

const clientSideIsBrowserSupported = (userAgent) => {
  return !isInternetExplorer(userAgent);
};

const isInternetExplorer = (userAgent) => {
  var msie = userAgent.indexOf("MSIE ");
  if (msie > 0 || !!userAgent.match(/Trident.*rv\:11\./)) return true;
  else return false;
};

export default class BrowserSupportUtilities {
  static isBrowserSupported(ctx = null) {
    if (typeof window !== "undefined" && window.navigator && window.navigator.userAgent) return clientSideIsBrowserSupported(window.navigator.userAgent);
    else if (ctx && ctx.req && ctx.req.headers && ctx.req.headers["user-agent"]) return serverSideIsBrowserUnsupported(ctx.req.headers["user-agent"]);
    else {
      console.error("Something weird happened in BrowserSupportUtilities isBrowserSupported");
      return true;
    }
  }
}
