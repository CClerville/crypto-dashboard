"use client";

import useProducts from "@/hooks/useProducts";
import { useMemo } from "react";

import BlinkText from "./BlinkText";
import Chart from "./Chart";
import styles from "./TickerCard.module.css";

type TickerCardProps = {
  price: string;
  product_id: string;
  high_24h: string;
  low_24h: string;
  open_24h: string;
};

export default function TickerCard({
  price,
  product_id,
  high_24h,
  low_24h,
  open_24h,
}: TickerCardProps) {
  const { productHistoricalData } = useProducts();

  const formatedProductId = useMemo(
    () => product_id.split("-").join("/"),
    [product_id]
  );

  const changeInPrice = useMemo(
    () => (parseFloat(price) - parseFloat(open_24h)).toFixed(5),
    [open_24h, price]
  );

  const pctChange = useMemo(
    () => ((parseFloat(changeInPrice) / parseFloat(open_24h)) * 100).toFixed(2),
    [changeInPrice, open_24h]
  );

  const isPositiveChange = parseFloat(changeInPrice) >= 0;
  const bgColorCls = isPositiveChange ? styles.green_bg : styles.red_bg;

  const candleData = productHistoricalData?.get(product_id);

  return (
    <main className={`${styles.container} ${bgColorCls}`}>
      <div className={styles.meta_container}>
        <div className={styles.left_meta_container}>
          <div className={styles.product_id}>{formatedProductId}</div>
          <div className={styles.price}>
            <BlinkText text={price} data={price} />
          </div>
        </div>
        <div className={styles.right_meta_container}>
          <div className={styles.change_container}>
            <div className={styles.pct_change}>
              <BlinkText
                text={`${isPositiveChange ? "+" : ""}${pctChange}%`}
                data={pctChange}
              />
            </div>
            <div className={styles.separator} />
            <div className={styles.price_change}>
              <BlinkText text={changeInPrice} data={changeInPrice} />
            </div>
          </div>
          <div className={styles.high_low_container}>
            <div className={styles.high}>
              <BlinkText text={`H ${high_24h}`} data={high_24h} />
            </div>
            <div className={styles.low}>
              <BlinkText text={`L ${low_24h}`} data={low_24h} />
            </div>
          </div>
        </div>
      </div>
      <Chart {...{ productHistoricalData, candleData }} />
    </main>
  );
}
