import asyncUtilities from "../util/asyncUtilities";
import fetch from "isomorphic-unfetch";
import { APIURL } from "../util/constants";

const AUTHURL = `${APIURL}/auth`;

export async function loginAsync(username, password) {
  console.log(AUTHURL);
  const res = await fetch(AUTHURL, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username: username, password: password })
  });
  const data = await res.json();
  console.log(data);
}
