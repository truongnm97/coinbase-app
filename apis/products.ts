"use server";

import authRequest from "./handlers";

export async function getProducts() {
  const url = `${process.env.COINBASE_API_URL}/products`;

  const res = await authRequest<IProduct[]>(url);

  return res.data;
}

export async function getProductsStats() {
  const url = `${process.env.COINBASE_API_URL}/products/stats`;

  const res = await authRequest<{ [key: string]: IProductStats }>(url);

  return res.data;
}

export async function getProductStats(productId: string) {
  const url = `${process.env.COINBASE_API_URL}/products/${productId}/stats`;

  const res = await authRequest(url);

  return res.data;
}

export async function getProductCandles(
  productId: string,
  params?: IProductCandleParams,
) {
  const url = `${process.env.COINBASE_API_URL}/products/${productId}/candles`;

  const res = await authRequest<TProductCandle[]>(url, { params });

  return res.data;
}
