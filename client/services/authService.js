import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const AUTHURL = `${publicRuntimeConfig.apiUrl}/auth`;
const AUTHCREDENTIALSURL = `${AUTHURL}/credentials`;
const AUTHEMAILMFAURL = `${AUTHURL}/emailMfa`;

export async function authenticateCredentialsAsync(username, password, captcha) {
  const res = await fetch(AUTHCREDENTIALSURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password, captcha: captcha }),
  });
  return res;
}

export async function authenticateEmailMfaAsync(emailCode) {
  const res = await fetch(AUTHEMAILMFAURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emailCode: emailCode }),
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
