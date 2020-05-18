import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const APIURL = `${publicRuntimeConfig.apiProtocol}://${publicRuntimeConfig.apiAddress}:${publicRuntimeConfig.apiPort}`;

const PHOTOSAPIURL = `${APIURL}/medias`;
const PHOTOCATEGORIESURL = `${APIURL}/mediaCategories`;
const FEATUREDMEDIASAPIURL = `${APIURL}/featured/media`;

export async function getVideosAsync(options) {
  let query = "";

  if (options) {
    if (options.limit) query += query ? `&limit=${options.limit}` : `?limit=${options.limit}`;
    if (options.offset) query += query ? `&offset=${options.offset}` : `?offset=${options.offset}`;
    if (options.search) query += query ? `&search=${options.search}` : `?search=${options.search}`;
    if (options.category) query += query ? `&category=${options.category}` : `?category=${options.category}`;
    if (options.dateOrder) query += query ? `&dateOrder=${options.dateOrder}` : `?dateOrder=${options.category}`;
  }

  const res = await fetch(PHOTOSAPIURL + query);
  return res;
}

export async function getVideoAsync(mediaId) {
  const requestUrl = PHOTOSAPIURL + "/" + mediaId;
  const res = await fetch(requestUrl);
  return res;
}

export async function createVideoAsync(media) {
  const res = await fetch(PHOTOSAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(media),
  });
  return res;
}

export async function updateVideoAsync(media) {
  const body = { ...media };
  delete body._id;

  const res = await fetch(`${PHOTOSAPIURL}/${media._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteVideoAsync(mediaId) {
  const res = await fetch(`${PHOTOSAPIURL}/${mediaId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function getVideoCategoryAsync(categoryId) {
  const requestUrl = PHOTOCATEGORIESURL + "/" + categoryId;
  const res = await fetch(requestUrl);
  return res;
}

export async function getVideoCategoriesAsync() {
  const res = await fetch(PHOTOCATEGORIESURL);
  return res;
}

export async function createVideoCategoryAsync(name, slug) {
  const res = await fetch(PHOTOCATEGORIESURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, slug: slug }),
  });
  return res;
}

export async function updateVideoCategoryAsync(category) {
  const body = { ...category };
  delete body._id;

  const res = await fetch(`${PHOTOCATEGORIESURL}/${category._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteVideoCategoryAsync(mediaCategoryId) {
  console.log("Making request to", `${PHOTOCATEGORIESURL}/${mediaCategoryId}`);
  const res = await fetch(`${PHOTOCATEGORIESURL}/${mediaCategoryId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
