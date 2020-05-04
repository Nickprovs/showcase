const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  return {
    //Public runtime config is for both the next client and server. There is also a server-only option (serverRuntimeConfig).
    publicRuntimeConfig: getPublicRuntimeConfig(phase),
    webpack: function (cfg) {
      const originalEntry = cfg.entry;
      cfg.entry = async () => {
        const entries = await originalEntry();

        if (entries["main.js"] && !entries["main.js"].includes("./client/polyfills.js")) {
          entries["main.js"].unshift("./client/polyfills.js");
        }

        return entries;
      };

      return cfg;
    },
  };
};

function getPublicRuntimeConfig(phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      apiProtocol: getApiProtocolFromEnvOrOptionallyThrow(false) || "http",
      apiAddress: getApiAddressFromEnvOrOptionallyThrow(false) || "localhost",
      apiPort: getApiPortFromEnvOrOptionallyThrow(false) || "8080",
    };
  }
  return {
    apiProtocol: getApiProtocolFromEnvOrOptionallyThrow(true),
    apiAddress: getApiAddressFromEnvOrOptionallyThrow(true),
    apiPort: getApiPortFromEnvOrOptionallyThrow(true),
  };
}

function getApiProtocolFromEnvOrOptionallyThrow(shouldThrowOnFail) {
  if (!process.env.nickprovs_apiProtocol && shouldThrowOnFail)
    throw new Error("Must set nickprovs_apiProtocol environment variable (http or https)");

  return process.env.nickprovs_apiProtocol;
}

function getApiAddressFromEnvOrOptionallyThrow(shouldThrowOnFail) {
  if (!process.env.nickprovs_apiAddress && shouldThrowOnFail) throw new Error("Must set nickprovs_apiAddress environment variable");
  return process.env.nickprovs_apiAddress;
}

function getApiPortFromEnvOrOptionallyThrow(shouldThrowOnFail) {
  if (!process.env.nickprovs_apiPort && shouldThrowOnFail) throw new Error("Must set nickprovs_apiPort environment variable");
  return process.env.nickprovs_apiPort;
}
