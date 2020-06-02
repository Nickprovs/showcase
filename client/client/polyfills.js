//Polyfill necessary for Joi on some browsers
if (RegExp.prototype.flags === undefined) {
  Object.defineProperty(RegExp.prototype, "flags", {
    configurable: true,
    get: function () {
      return this.toString().match(/[gimsuy]*$/)[0];
    },
  });
}

//Polyfill necessary for Joi on some browsers
if (typeof window["TextEncoder"] !== "function") {
  const TextEncodingPolyfill = require("text-encoding");
  window["TextEncoder"] = TextEncodingPolyfill.TextEncoder;
  window["TextDecoder"] = TextEncodingPolyfill.TextDecoder;
}
