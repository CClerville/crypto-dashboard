"use client";

import { useEffect, useState } from "react";

import dayjs from "dayjs";

dayjs().format();

const MAX_PRODUCT_IDS_SUBSCRIPTION = 50;
const BASE_URL = "https://api.exchange.coinbase.com/products";

export type TickerData = Array<{
  time: string;
  price: number;
}>;

const useProducts = () => {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [productHistoricalData, setProductHistoricalData] =
    useState<Map<string, TickerData>>();

  useEffect(() => {
    async function getProductIds() {
      const response = await fetch(BASE_URL);
      const data = await response.json();

      const parsedData = data
        .slice(0, MAX_PRODUCT_IDS_SUBSCRIPTION)
        .map((p: any) => p.id);

      setProductIds(parsedData);
    }

    getProductIds();
  }, []);

  useEffect(() => {
    async function getProductHistoryData() {
      if (!productIds.length) return;

      const end = dayjs();
      const start = end.subtract(1, "month");

      function parseResponseData(_data: number[][]) {
        return (
          _data?.map?.((candle: number[]) => ({
            time: candle[0],
            price: candle[candle.length - 1],
          })) ?? []
        );
      }

      let data = await Promise.allSettled(
        productIds.map((p_id) => {
          return new Promise(async (resolve, reject) => {
            try {
              const response = await fetch(
                `${BASE_URL}/${p_id}/candles?granularity=86400&start=${start}&end=${end}`
              );
              const responseData = await response.json();
              resolve(parseResponseData(responseData));
            } catch (err) {
              reject(err);
            }
          });
        })
      );

      const parsedData = data.map((d: any) => d.value);

      const mappedHistoricalData = productIds.reduce(
        (acc: Map<string, TickerData>, curr: string, idx: number) => {
          acc.set(curr, parsedData?.[idx]);
          return acc;
        },
        new Map<string, TickerData>()
      );

      setProductHistoricalData(mappedHistoricalData);
    }
    getProductHistoryData();
  }, [productIds]);

  return { productIds, productHistoricalData };
};

export default useProducts;
