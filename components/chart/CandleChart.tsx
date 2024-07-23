"use client";
import {
  createChart,
  ColorType,
  IChartApi,
  CandlestickData,
  Time,
  ISeriesApi,
} from "lightweight-charts";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Spinner from "../spinner/Spinner";

interface ICandleChartColor {
  backgroundColor?: string;
  textColor?: string;
  upColor?: string;
  downColor?: string;
  wickUpColor?: string;
  wickDownColor?: string;
}

interface ICandleChartProps {
  data: CandlestickData<Time>[];
  colors?: ICandleChartColor;
  loading?: boolean;
}

export interface ICandleChartRef {
  chart: IChartApi | null;
  candleSeries: React.MutableRefObject<ISeriesApi<"Candlestick"> | null>;
}

function CandleChart(
  {
    data = [],
    loading = false,
    colors: {
      backgroundColor = "black",
      textColor = "white",
      upColor = "#26a69a",
      downColor = "#ef5350",
      wickUpColor = "#26a69a",
      wickDownColor = "#ef5350",
    } = {},
  }: ICandleChartProps,
  ref: React.Ref<ICandleChartRef | null>,
) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current == null) return;

    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: chartContainerRef.current?.clientWidth,
      });
    };

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      grid: {
        horzLines: {
          color: "#2B2C42",
        },
        vertLines: {
          color: "#2B2C42",
        },
      },
    });
    chartRef.current.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (chartRef.current == null) return;
    candleSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor,
      downColor,
      wickUpColor,
      wickDownColor,
      borderVisible: false,
    });
    candleSeriesRef.current.setData(data);

    return () => {
      if (chartRef.current == null) return;
      candleSeriesRef.current?.setData([]);
    };
  }, [data]);

  useImperativeHandle(ref, () => ({
    chart: chartRef.current,
    candleSeries: candleSeriesRef,
  }));

  return (
    <div className="relative min-h-[500px]">
      <div ref={chartContainerRef} />
      {loading && (
        <Spinner className="absolute flex w-full h-full flex justify-center items-center top-0 z-[2]" />
      )}
    </div>
  );
}

export default forwardRef(CandleChart);
