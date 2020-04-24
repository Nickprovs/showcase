import asyncUtilities from "../util/asyncUtilities";
import fetch from "isomorphic-unfetch";
import { APIURL } from "../util/constants";
import { Component } from "react";

const PHOTOSAPIURL = `${APIURL}/photos`;
const PHOTOCATEGORIESURL = `${APIURL}/photoCategories`;

export async function getPhotosAsync(options) {
  let query = "";
  if (options.limit) query += query ? `&limit=${options.limit}` : `?limit=${options.limit}`;
  if (options.offset) query += query ? `&offset=${options.offset}` : `?offset=${options.offset}`;
  if (options.search) query += query ? `&search=${options.search}` : `?search=${options.search}`;
  if (options.category) query += query ? `&category=${options.category}` : `?category=${options.category}`;

  const res = await fetch(PHOTOSAPIURL + query);
  return res;
}

export async function getPhotoAsync(photoId) {
  const requestUrl = PHOTOSAPIURL + "/" + photoId;
  const res = await fetch(requestUrl);
  return res;
}

export async function createPhotoAsync(photo) {
  const res = await fetch(PHOTOSAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photo),
  });
  return res;
}

export async function updatePhotoAsync(photo) {
  const body = { ...photo };
  delete body._id;

  const res = await fetch(`${PHOTOSAPIURL}/${photo._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deletePhotoAsync(photoId) {
  const res = await fetch(`${PHOTOSAPIURL}/${photoId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function getPhotoCategoryAsync(categoryId) {
  const requestUrl = PHOTOCATEGORIESURL + "/" + categoryId;
  const res = await fetch(requestUrl);
  return res;
}

export async function getPhotoCategoriesAsync() {
  const res = await fetch(PHOTOCATEGORIESURL);
  return res;
}

export async function createPhotoCategoryAsync(name, slug) {
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

export async function updatePhotoCategoryAsync(category) {
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

export async function deletePhotoCategoryAsync(photoCategoryId) {
  console.log("Making request to", `${PHOTOCATEGORIESURL}/${photoCategoryId}`);
  const res = await fetch(`${PHOTOCATEGORIESURL}/${photoCategoryId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
