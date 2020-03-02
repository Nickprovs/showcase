import includes from "core-js/library/fn/string/virtual/includes";
import repeat from "core-js/library/fn/string/virtual/repeat";
import assign from "core-js/library/fn/object/assign";

String.prototype.includes = includes;
String.prototype.repeat = repeat;
Object.assign = assign;

//Polyfill necessary for Joi on some browsers
if (RegExp.prototype.flags === undefined) {
  Object.defineProperty(RegExp.prototype, "flags", {
    configurable: true,
    get: function() {
      return this.toString().match(/[gimsuy]*$/)[0];
    }
  });
}

//Polyfill necessary for Joi on some browsers
if (typeof window["TextEncoder"] !== "function") {
  const TextEncodingPolyfill = require("text-encoding");
  window["TextEncoder"] = TextEncodingPolyfill.TextEncoder;
  window["TextDecoder"] = TextEncodingPolyfill.TextDecoder;
}
