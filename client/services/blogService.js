import asyncUtilities from "../util/asyncUtilities";
import fetch from "isomorphic-unfetch";
import { APIURL } from "../util/constants";

const BLOGSAPIURL = `${APIURL}/articles`;

export async function getBlogPreviewsAsync(limit = 10, offset = 0, search = "") {
  console.log("Requesting from: ", BLOGSAPIURL);
  const res = await fetch(BLOGSAPIURL);
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
