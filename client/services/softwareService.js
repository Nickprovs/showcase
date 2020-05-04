import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const APIURL = `${publicRuntimeConfig.apiProtocol}://${publicRuntimeConfig.apiAddress}:${publicRuntimeConfig.apiPort}`;
const SOFTWAREAPIURL = `${APIURL}/software`;
const SOFTWARECATEGORIESAPIURL = `${APIURL}/softwareCategories`;

export async function getSoftwaresAsync(options) {
  let query = "";
  if (options.limit) query += query ? `&limit=${options.limit}` : `?limit=${options.limit}`;
  if (options.offset) query += query ? `&offset=${options.offset}` : `?offset=${options.offset}`;
  if (options.search) query += query ? `&search=${options.search}` : `?search=${options.search}`;
  if (options.category) query += query ? `&category=${options.category}` : `?category=${options.category}`;

  const res = await fetch(SOFTWAREAPIURL + query);
  return res;
}

export async function getSoftwareAsync(softwareIdOrSlug) {
  const requestUrl = SOFTWAREAPIURL + "/" + softwareIdOrSlug;
  const res = await fetch(requestUrl);
  return res;
}

export async function createSoftwareAsync(software) {
  const res = await fetch(SOFTWAREAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(software),
  });
  return res;
}

export async function updateSoftwareAsync(software) {
  const body = { ...software };
  delete body._id;

  const res = await fetch(`${SOFTWAREAPIURL}/${software._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteSoftwareAsync(softwareId) {
  const res = await fetch(`${SOFTWAREAPIURL}/${softwareId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function getSoftwareCategoryAsync(categoryId) {
  const requestUrl = SOFTWARECATEGORIESAPIURL + "/" + categoryId;
  const res = await fetch(requestUrl);
  return res;
}

export async function getSoftwareCategoriesAsync() {
  const res = await fetch(SOFTWARECATEGORIESAPIURL);
  return res;
}

export async function createSoftwareCategoryAsync(name, slug) {
  const res = await fetch(SOFTWARECATEGORIESAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, slug: slug }),
  });
  return res;
}

export async function updateSoftwareCategoryAsync(category) {
  const body = { ...category };
  delete body._id;

  const res = await fetch(`${SOFTWARECATEGORIESAPIURL}/${category._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteSoftwareCategoryAsync(softwareCategoryId) {
  console.log("Making request to", `${SOFTWARECATEGORIESAPIURL}/${softwareCategoryId}`);
  const res = await fetch(`${SOFTWARECATEGORIESAPIURL}/${softwareCategoryId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
