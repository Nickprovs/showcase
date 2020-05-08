import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const APIURL = `${publicRuntimeConfig.apiProtocol}://${publicRuntimeConfig.apiAddress}:${publicRuntimeConfig.apiPort}`;
const FEATUREDAPIURL = `${APIURL}/featured`;

export async function getFeaturedAsync(options) {
  const res = await fetch(FEATUREDAPIURL + query);
  return res;
}
