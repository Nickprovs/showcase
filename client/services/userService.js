import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const MEURL = `${publicRuntimeConfig.apiUrl}/me`;

export async function getCurrentUserAsync(context) {
  const fetchRequest = {
    method: "get",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  //If this is a SSR request
  if (context.req) fetchRequest.headers.Cookie = context.req.headers.cookie;

  const res = await fetch(MEURL, fetchRequest);
  return res;
}
