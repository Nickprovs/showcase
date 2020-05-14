import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const APIURL = `${publicRuntimeConfig.apiProtocol}://${publicRuntimeConfig.apiAddress}:${publicRuntimeConfig.apiPort}`;
const FEATUREDAPIURL = `${APIURL}/featured`;
const FEATUREDPRIMARYAPIURL = `${FEATUREDAPIURL}/primary`;
const FEATUREDSUBSIDIARIESAPIURL = `${FEATUREDAPIURL}/subsidiaries`;

export async function getFeaturedAsync(options) {
  let query = "";
  if (options) {
    if (options.scope) query += query ? `&scope=${options.scope}` : `?scope=${options.scope}`;
  }

  const res = await fetch(FEATUREDAPIURL + query);
  return res;
}

export async function getFeaturedSubsidiariesAsync(options) {
  let query = "";
  if (options) {
    if (options.scope) query += query ? `&scope=${options.scope}` : `?scope=${options.scope}`;
  }

  const res = await fetch(FEATUREDSUBSIDIARIESAPIURL + query);
  return res;
}

export async function getFeaturedPrimaryAsync() {
  const res = await fetch(FEATUREDPRIMARYAPIURL);
  return res;
}

export async function createFeaturedSubsidiaryAsync(subsidiary) {
  const res = await fetch(FEATUREDSUBSIDIARIESAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subsidiary),
  });
  return res;
}

export async function updateFeaturedPrimaryAsync(primary) {
  const res = await fetch(FEATUREDPRIMARYAPIURL, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(primary),
  });
  return res;
}

export async function patchFeaturedSubsidiaryAsync(subsidiaryId, options) {
  let query = "";
  if (options) {
    if (options.operation) query += query ? `&operation=${options.operation}` : `?operation=${options.operation}`;
  }

  const res = await fetch(FEATUREDSUBSIDIARIESAPIURL + "/" + subsidiaryId, {
    method: "patch",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function deleteFeaturedSubsidiariesAsync() {
  const res = await fetch(FEATUREDSUBSIDIARIESAPIURL, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function deleteFeaturedSubsidiaryAsync(subsidiaryId) {
  const res = await fetch(FEATUREDSUBSIDIARIESAPIURL + "/" + subsidiaryId, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
