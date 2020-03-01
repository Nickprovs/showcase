module.exports = {
  webpack: function(cfg) {
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
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiProtocol: getApiProtocolFromEnvOrThrow(),
    apiAddress: getApiAddressFromEnvOrThrow(),
    apiPort: getApiPortFromEnvOrThrow()
  }
};

function getApiProtocolFromEnvOrThrow() {
  if (!process.env.nickprovs_apiProtocol) throw new Error("Must set nickprovs_apiProtocol environment variable (http or https)");

  return process.env.nickprovs_apiProtocol;
}

function getApiAddressFromEnvOrThrow() {
  if (!process.env.nickprovs_apiAddress) throw new Error("Must set nickprovs_apiAddress environment variable");

  return process.env.nickprovs_apiAddress;
}

function getApiPortFromEnvOrThrow() {
  if (!process.env.nickprovs_apiPort) throw new Error("Must set nickprovs_apiPort environment variable");

  return process.env.nickprovs_apiPort;
}
