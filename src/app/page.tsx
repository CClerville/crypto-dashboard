"use client";

import { useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import useProducts from "@/hooks/useProducts";
import styles from "./page.module.css";
import isEmpty from "lodash.isempty";
import TickerCard from "@/components/TickerCard/TickerCard";

type TickerMessage = {
  type: string;
  sequence: number;
  product_id: string;
  price: string;
  open_24h: string;
  volume_24h: string;
  low_24h: string;
  high_24h: string;
  volume_30d: string;
  best_bid: string;
  best_bid_size: string;
  best_ask: string;
  best_ask_size: string;
  side: string;
  time: string;
  trade_id: number;
  last_size: string;
};

type Ticker = {
  [key: string]: TickerMessage;
};

type State = {
  ticker: Ticker;
  errors: string[];
};

function getInitState(): State {
  return {
    ticker: {},
    errors: [],
  };
}

export default function Home() {
  const [products, dispatch] = useReducer((state: State, action: any) => {
    const { type, payload } = action;
    switch (type) {
      case "ticker": {
        return {
          ...state,
          ticker: {
            ...state.ticker,
            [payload.product_id]: {
              ...payload,
            },
          },
        };
      }
      case "error": {
        return {
          ...state,
          errors: [...state.errors, payload.reason],
        };
      }
      default:
        return state;
    }
  }, getInitState());

  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
    "wss://ws-feed.exchange.coinbase.com",
    {
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  const { productIds } = useProducts();

  useEffect(() => {
    // check if websocket is open
    if (readyState === ReadyState.OPEN && productIds.length) {
      sendJsonMessage({
        type: "subscribe",
        product_ids: productIds,
        channels: ["ticker_batch"],
      });
    }
  }, [readyState, sendJsonMessage, productIds]);

  useEffect(() => {
    if (!isEmpty(lastJsonMessage)) {
      const { type, ...payload } = lastJsonMessage as TickerMessage;
      dispatch({ type, payload });
    }
  }, [lastJsonMessage]);

  return (
    <main className={styles.main}>
      <div className={styles.dashboard_container}>
        {Object.keys(products.ticker).map((p_id: string) => (
          <TickerCard key={p_id} {...products.ticker[p_id]} />
        ))}
      </div>
    </main>
  );
}
