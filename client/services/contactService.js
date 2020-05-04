import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const APIURL = `${publicRuntimeConfig.apiProtocol}://${publicRuntimeConfig.apiAddress}:${publicRuntimeConfig.apiPort}`;
const CONTACTURL = `${APIURL}/contact`;

export async function contactAsync(contactData) {
  const res = await fetch(CONTACTURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
  return res;
}
