import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const GENERALAPIURL = `${publicRuntimeConfig.apiUrl}/general`;

export async function getGeneralAsync(options) {
  let query = "";
  if (options) {
    if (options.scope) query += query ? `&scope=${options.scope}` : `?scope=${options.scope}`;
  }

  const res = await fetch(GENERALAPIURL + query);
  return res;
}
export async function updateGeneralAsync(general) {
  const res = await fetch(GENERALAPIURL, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(general),
  });
  return res;
}
