import fetch from "isomorphic-unfetch";
import { APIURL } from "../util/constants";

const AUTHURL = `${APIURL}/auth`;

export async function loginAsync(username, password) {
  console.log(AUTHURL);
  const res = await fetch(AUTHURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username: username, password: password })
  });
  return res;
}

export async function logoutAsync() {
  const res = await fetch(AUTHURL, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return res;
}