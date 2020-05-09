import asyncUtilities from "../util/asyncUtilities";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const APIURL = `${publicRuntimeConfig.apiProtocol}://${publicRuntimeConfig.apiAddress}:${publicRuntimeConfig.apiPort}`;
const BLOGSAPIURL = `${APIURL}/articles`;
const BLOGGENRESAPIURL = `${APIURL}/articleCategories`;
const FEATUREDBLOGSAPIURL = `${APIURL}/featured/article`;

export async function getBlogsAsync(options) {
  let query = "";

  if (options) {
    if (options.limit) query += query ? `&limit=${options.limit}` : `?limit=${options.limit}`;
    if (options.offset) query += query ? `&offset=${options.offset}` : `?offset=${options.offset}`;
    if (options.search) query += query ? `&search=${options.search}` : `?search=${options.search}`;
    if (options.category) query += query ? `&category=${options.category}` : `?category=${options.category}`;
    if (options.dateOrder) query += query ? `&dateOrder=${options.dateOrder}` : `?dateOrder=${options.category}`;
  }

  const res = await fetch(BLOGSAPIURL + query);
  return res;
}

export async function getBlogAsync(blogIdOrSlug) {
  const requestUrl = BLOGSAPIURL + "/" + blogIdOrSlug;
  const res = await fetch(requestUrl);
  return res;
}

export async function createBlogAsync(blog) {
  const res = await fetch(BLOGSAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  });
  return res;
}

export async function updateBlogAsync(blog) {
  const body = { ...blog };
  delete body._id;

  const res = await fetch(`${BLOGSAPIURL}/${blog._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteBlogAsync(blogId) {
  const res = await fetch(`${BLOGSAPIURL}/${blogId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function getBlogCategoryAsync(categoryId) {
  const requestUrl = BLOGGENRESAPIURL + "/" + categoryId;
  const res = await fetch(requestUrl);
  return res;
}

export async function getBlogCategoriesAsync() {
  const res = await fetch(BLOGGENRESAPIURL);
  return res;
}

export async function createBlogCategoryAsync(name, slug) {
  const res = await fetch(BLOGGENRESAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, slug: slug }),
  });
  return res;
}

export async function updateBlogCategoryAsync(category) {
  const body = { ...category };
  delete body._id;

  const res = await fetch(`${BLOGGENRESAPIURL}/${category._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteBlogCategoryAsync(blogCategoryId) {
  console.log("Making request to", `${BLOGGENRESAPIURL}/${blogCategoryId}`);
  const res = await fetch(`${BLOGGENRESAPIURL}/${blogCategoryId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function getFeaturedBlogAsync() {
  const res = await fetch(`${FEATUREDBLOGSAPIURL}`, {
    method: "get",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function updateFeaturedBlogAsync(updated) {
  console.log("updated", updated);
  const res = await fetch(`${FEATUREDBLOGSAPIURL}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updated),
  });
  return res;
}

export async function deleteFeaturedBlogAsync() {
  const res = await fetch(`${FEATUREDBLOGSAPIURL}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
