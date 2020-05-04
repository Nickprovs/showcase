const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const fileSystem = require("fs");

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
    //Parse a dev config if it exists
    let devConfig = null;
    let devConfigFilePath = "./config/development.json";
    let devConfigFileExists = fileSystem.existsSync(devConfigFilePath) && fileSystem.lstatSync(devConfigFilePath).isFile();
    if (devConfigFileExists) {
      let rawDevConfigData = fileSystem.readFileSync("./config/development.json");
      devConfig = JSON.parse(rawDevConfigData);
    }

    return {
      apiProtocol: getApiProtocolFromEnvOrOptionallyThrow(!devConfigFileExists) || devConfig.apiProtocol,
      apiAddress: getApiAddressFromEnvOrOptionallyThrow(!devConfigFileExists) || devConfig.apiAddress,
      apiPort: getApiPortFromEnvOrOptionallyThrow(!devConfigFileExists) || devConfig.apiPort,
      recaptchaSiteKey: getApiPortFromEnvOrOptionallyThrow(!devConfigFileExists) || devConfig.recaptchaSiteKey,
    };
  }

  //For all non dev configurations -- only get data from environment
  return {
    apiProtocol: getApiProtocolFromEnvOrOptionallyThrow(true),
    apiAddress: getApiAddressFromEnvOrOptionallyThrow(true),
    apiPort: getApiPortFromEnvOrOptionallyThrow(true),
    recaptchaSiteKey: getRecaptchaSiteKeyFromEnvOrOptionallyThrow(true),
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

function getRecaptchaSiteKeyFromEnvOrOptionallyThrow(shouldThrowOnFail) {
  if (!process.env.nickprovs_recaptchaSiteKey && shouldThrowOnFail)
    throw new Error("Must set nickprovs_recaptchaSiteKey environment variable");
  return process.env.nickprovs_recaptchaSiteKey;
}
