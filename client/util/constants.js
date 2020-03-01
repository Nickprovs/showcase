import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

if (!publicRuntimeConfig.apiProtocol) throw new Error("API Protocol not configured");

if (!publicRuntimeConfig.apiAddress) throw new Error("API Address not configured");

if (!publicRuntimeConfig.apiPort) throw new Error("API Port not configured");

export const APIURL = `${publicRuntimeConfig.apiProtocol}://${publicRuntimeConfig.apiAddress}:${publicRuntimeConfig.apiPort}`;
