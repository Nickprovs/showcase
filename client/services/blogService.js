import asyncUtilities from "../util/asyncUtilities";
import fetch from "isomorphic-unfetch";
import { APIURL } from "../util/constants";

const BLOGSAPIURL = `${APIURL}/articles`;
const BLOGGENRESAPIURL = `${APIURL}/articleCategories`;



export async function createBlogCategoryAsync(name, slug){
  const res = await fetch(BLOGGENRESAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: name, slug: slug })
  });
  return res;
}

export async function saveBlogAsync(blog){
  const res = await fetch(BLOGSAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(blog)
  });
  return res;
}

export async function deleteBlogAsync(blogId){
  const res = await fetch(`${BLOGSAPIURL}/${blogId}` , {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return res;
}

export async function getBlogCategoriesAsync() {
  const res = await fetch(BLOGGENRESAPIURL);
  const data = await res.json();
  return data;
}

export async function getBlogsAsync(options) {
  let query = "";
  if (options.limit) query += query ? `&limit=${options.limit}` : `?limit=${options.limit}`;
  if (options.offset) query += query ? `&offset=${options.offset}` : `?offset=${options.offset}`;
  if (options.search) query += query ? `&search=${options.search}` : `?search=${options.search}`;
  if (options.category) query += query ? `&category=${options.category}` : `?category=${options.category}`;

  const res = await fetch(BLOGSAPIURL + query);
  const data = await res.json();
  return data;
}

export async function getBlogAsync(blogIdOrSlug) {
  const requestUrl = BLOGSAPIURL + "/" + blogIdOrSlug;
  const res = await fetch(requestUrl);
  const data = await res.json();
  return data;
}
