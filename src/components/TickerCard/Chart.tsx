"use client";

import { LinePlot } from "@mui/x-charts/LineChart";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";

import styles from "./Chart.module.css";
import { TickerData } from "@/hooks/useProducts";

type ChartProps = {
  productHistoricalData: Map<string, TickerData> | undefined;
  candleData: TickerData | undefined;
};

const Chart = ({ productHistoricalData, candleData }: ChartProps) => {
  return (
    <div className={styles.ticker_chart_container}>
      {!!productHistoricalData?.size && !!candleData?.length ? (
        <ResponsiveChartContainer
          margin={{ top: 20, left: 10, right: 10, bottom: 30 }}
          dataset={candleData}
          xAxis={[{ dataKey: "time", scaleType: "time" }]}
          series={[
            {
              dataKey: "price",
              type: "line",
              color: "white",
            },
          ]}
        >
          <LinePlot />
        </ResponsiveChartContainer>
      ) : (
        <div className={styles.no_chart_data_container}>
          <div>{`${
            !productHistoricalData?.size ? "Loading..." : "No Chart Data"
          }`}</div>
        </div>
      )}
    </div>
  );
};

export default Chart;
