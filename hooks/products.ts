import { getProductCandles, getProducts } from "@/apis/products";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useProducts(
  config?: UseQueryOptions<IProduct[], AxiosError, IProduct[], string[]>,
) {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    ...config,
  });
}

export function useProductCandles(
  productId: string,
  params: IProductCandleParams = {},
  config?: UseQueryOptions<
    TProductCandle[],
    AxiosError,
    TProductCandle[],
    string[]
  >,
) {
  return useQuery({
    queryKey: ["product-candles", productId, ...Object.values(params)],
    queryFn: () => getProductCandles(productId, params),
    ...config,
  });
}
