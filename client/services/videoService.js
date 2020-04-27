import asyncUtilities from "../util/asyncUtilities";
import fetch from "isomorphic-unfetch";
import { APIURL } from "../util/constants";
import { Component } from "react";

const PHOTOSAPIURL = `${APIURL}/videos`;
const PHOTOCATEGORIESURL = `${APIURL}/videoCategories`;

export async function getVideosAsync(options) {
  let query = "";
  if (options.limit) query += query ? `&limit=${options.limit}` : `?limit=${options.limit}`;
  if (options.offset) query += query ? `&offset=${options.offset}` : `?offset=${options.offset}`;
  if (options.search) query += query ? `&search=${options.search}` : `?search=${options.search}`;
  if (options.category) query += query ? `&category=${options.category}` : `?category=${options.category}`;

  const res = await fetch(PHOTOSAPIURL + query);
  return res;
}

export async function getVideoAsync(videoId) {
  const requestUrl = PHOTOSAPIURL + "/" + videoId;
  const res = await fetch(requestUrl);
  return res;
}

export async function createVideoAsync(video) {
  const res = await fetch(PHOTOSAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(video),
  });
  return res;
}

export async function updateVideoAsync(video) {
  const body = { ...video };
  delete body._id;

  const res = await fetch(`${PHOTOSAPIURL}/${video._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteVideoAsync(videoId) {
  const res = await fetch(`${PHOTOSAPIURL}/${videoId}`, {
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

export async function deleteVideoCategoryAsync(videoCategoryId) {
  console.log("Making request to", `${PHOTOCATEGORIESURL}/${videoCategoryId}`);
  const res = await fetch(`${PHOTOCATEGORIESURL}/${videoCategoryId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
