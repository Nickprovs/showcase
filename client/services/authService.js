import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const APIURL = `${publicRuntimeConfig.apiProtocol}://${publicRuntimeConfig.apiAddress}:${publicRuntimeConfig.apiPort}`;
const AUTHURL = `${APIURL}/auth`;

export async function loginAsync(username, password) {
  console.log(AUTHURL);
  const res = await fetch(AUTHURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });
  return res;
}

export async function logoutAsync() {
  const res = await fetch(AUTHURL, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
