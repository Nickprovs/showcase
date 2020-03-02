import asyncUtilities from "../util/asyncUtilities";
import fetch from "isomorphic-unfetch";
import { APIURL } from "../util/constants";

const BLOGSAPIURL = `${APIURL}/articles`;

export async function getBlogPreviewsAsync(options) {
  console.log("Requesting from: ", BLOGSAPIURL);
  let query = "";
  if (options.limit) query += query ? `&limit=${options.limit}` : `?limit=${options.limit}`;
  if (options.offset) query += query ? `&offset=${options.offset}` : `?offset=${options.offset}`;

  const res = await fetch(BLOGSAPIURL + query);
  const data = await res.json();
  console.log(data);
  return data;
}

export async function getBlogAsync(blogIdOrSlug) {
  const requestUrl = BLOGSAPIURL + "/" + blogIdOrSlug;
  console.log("Requesting from: ", requestUrl);
  const res = await fetch(requestUrl);
  const data = await res.json();
  console.log(data);
  return data;
}
