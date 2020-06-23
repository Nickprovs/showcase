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
  let configFile = null;
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    //Parse a dev config if it exists
    let devConfigFilePath = "./config/development.json";
    let devConfigFileExists = fileSystem.existsSync(devConfigFilePath) && fileSystem.lstatSync(devConfigFilePath).isFile();
    if (devConfigFileExists) {
      let rawDevConfigData = fileSystem.readFileSync("./config/development.json");
      configFile = JSON.parse(rawDevConfigData);
    }
  }

  //Configuration will usually come from environment -- but also potentially a config file for convenience
  publicRuntimeConfig = {
    apiUrl: process.env.API_URL || (configFile && configFile.apiUrl),
    captchaPublicKey: process.env.CAPTCHA_PUBLIC_KEY || (configFile && configFile.captchaPublicKey),
  };

  validatePublicRuntimeConfig(publicRuntimeConfig);
  return publicRuntimeConfig;
}

function validatePublicRuntimeConfig(publicRuntimeConfig) {
  // if (!publicRuntimeConfig.apiUrl) throw new Error("Must set API_URL environment variable");
  // if (!publicRuntimeConfig.captchaPublicKey) throw new Error("Must set CAPTCHA_PUBLIC_KEY environment variable");
}
