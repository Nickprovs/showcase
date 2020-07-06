import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const PORTFOLIOAPIURL = `${publicRuntimeConfig.apiUrl}/portfolio`;
const PORTFOLIOCATEGORIESAPIURL = `${publicRuntimeConfig.apiUrl}/portfolioCategories`;

export async function getPortfoliosAsync(options) {
  let query = "";

  if (options) {
    if (options.limit) query += query ? `&limit=${options.limit}` : `?limit=${options.limit}`;
    if (options.offset) query += query ? `&offset=${options.offset}` : `?offset=${options.offset}`;
    if (options.search) query += query ? `&search=${options.search}` : `?search=${options.search}`;
    if (options.category) query += query ? `&category=${options.category}` : `?category=${options.category}`;
    if (options.dateOrder) query += query ? `&dateOrder=${options.dateOrder}` : `?dateOrder=${options.category}`;
  }

  const res = await fetch(PORTFOLIOAPIURL + query);
  return res;
}

export async function getPortfolioAsync(portfolioIdOrSlug) {
  const requestUrl = PORTFOLIOAPIURL + "/" + portfolioIdOrSlug;
  const res = await fetch(requestUrl);
  return res;
}

export async function createPortfolioAsync(portfolio) {
  const res = await fetch(PORTFOLIOAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(portfolio),
  });
  return res;
}

export async function updatePortfolioAsync(portfolio) {
  const body = { ...portfolio };
  delete body._id;

  const res = await fetch(`${PORTFOLIOAPIURL}/${portfolio._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deletePortfolioAsync(portfolioId) {
  const res = await fetch(`${PORTFOLIOAPIURL}/${portfolioId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function getPortfolioCategoryAsync(categoryId) {
  const requestUrl = PORTFOLIOCATEGORIESAPIURL + "/" + categoryId;
  const res = await fetch(requestUrl);
  return res;
}

export async function getPortfolioCategoriesAsync() {
  const res = await fetch(PORTFOLIOCATEGORIESAPIURL);
  return res;
}

export async function createPortfolioCategoryAsync(name, slug) {
  const res = await fetch(PORTFOLIOCATEGORIESAPIURL, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, slug: slug }),
  });
  return res;
}

export async function updatePortfolioCategoryAsync(category) {
  const body = { ...category };
  delete body._id;

  const res = await fetch(`${PORTFOLIOCATEGORIESAPIURL}/${category._id}`, {
    method: "put",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function deletePortfolioCategoryAsync(portfolioCategoryId) {
  console.log("Making request to", `${PORTFOLIOCATEGORIESAPIURL}/${portfolioCategoryId}`);
  const res = await fetch(`${PORTFOLIOCATEGORIESAPIURL}/${portfolioCategoryId}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
