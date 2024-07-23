"use client";
import { CandleChart, ICandleChartRef } from "@/components";
import { useProductCandles, useProducts } from "@/hooks/products";
import { useCoinbaseSocket } from "@/hooks/socket";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Duration, sub } from "date-fns";
import { CandlestickData, Time } from "lightweight-charts";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

interface ITimeDropdownData {
  label: string;
  value: IProductCandleParams["granularity"];
  duration: Duration;
}

const timeDropdownData: ITimeDropdownData[] = [
  {
    label: "1m",
    value: 60,
    duration: {
      hours: 5,
    },
  },
  {
    label: "5m",
    value: 300,
    duration: {
      hours: 25,
    },
  },
  {
    label: "15m",
    value: 900,
    duration: {
      hours: 75,
    },
  },
  {
    label: "1h",
    value: 3600,
    duration: {
      hours: 300,
    },
  },
  {
    label: "6h",
    value: 21600,
    duration: {
      days: 75,
    },
  },
  {
    label: "1d",
    value: 86400,
    duration: {
      days: 300,
    },
  },
];

export default function Page({ params: { productId = "" } }) {
  const chartRef = useRef<ICandleChartRef>(null);
  const [granularity, setGranularity] = useState<ITimeDropdownData>(
    timeDropdownData[0],
  );

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    return {
      startDate: sub(now, granularity.duration).toISOString(),
      endDate: now.toISOString(),
    };
  }, [granularity]);

  const { data: productsData } = useProducts();

  const {
    data: candleChartData,
    isLoading: isCandleChartLoading,
    error: candleChartError,
  } = useProductCandles(productId, {
    granularity: granularity.value,
    start: startDate,
    end: endDate,
  });

  useCoinbaseSocket(
    {
      productId,
      onMessage: (data) => {
        if (chartRef.current?.candleSeries.current == null) return;

        if (data.type === "match") {
          const candleData = chartRef.current.candleSeries.current.data();
          const timeStep = granularity.value || 60;
          const time = (Math.floor(
            new Date(data.time).getTime() / 1000 / timeStep,
          ) * timeStep) as Time;
          const lastCandle = candleData[
            candleData.length - 1
          ] as CandlestickData;
          const close = Number(data.price);
          const candleStickData: CandlestickData = {
            time,
            close,
            open: close,
            high: close,
            low: close,
          };

          if (time == lastCandle?.time) {
            candleStickData.high = Math.max(lastCandle.high, close);
            candleStickData.low = Math.min(lastCandle.low, close);
            candleStickData.open = lastCandle.open;
          }

          chartRef.current.candleSeries.current.update(candleStickData);
        }
      },
    },
    [granularity],
  );

  const convertedProductCandle: CandlestickData[] = useMemo(() => {
    if (candleChartData == null) return [];

    return candleChartData
      .map(([time, low, high, open, close]) => ({
        time: time as Time,
        low,
        high,
        open,
        close,
      }))
      .reverse();
  }, [candleChartData]);

  useEffect(() => {
    if (candleChartError) {
      toast.error(candleChartError.message);
    }
  }, [candleChartError]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="flex flex-col gap-4 py-4">
        <div className="flex gap-4">
          <Link
            href="/"
            className="w-fit inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
          >
            <span className="material-symbols-rounded">home</span>
          </Link>
          <Menu>
            <MenuButton className="w-fit inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
              {productId}
              <Image
                src={"/angle-down.svg"}
                width={10}
                height={10}
                className=" ms-3"
                alt="Angle Down"
              />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom start"
              unmount={false}
              className="z-[2] h-80 w-52 origin-top-right rounded-xl border border-white/5 bg-gray-900 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              {productsData
                ?.filter((item) => item.status === "online")
                .map(({ id, display_name }) => (
                  <MenuItem key={id}>
                    <Link
                      href={id}
                      className="z-10 group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                    >
                      {display_name}
                    </Link>
                  </MenuItem>
                ))}
            </MenuItems>
          </Menu>
          <Menu>
            <MenuButton className="w-fit inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
              {granularity.label}
              <Image
                src={"/angle-down.svg"}
                width={10}
                height={10}
                className=" ms-3"
                alt="Angle Down"
              />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom start"
              className="z-[2] w-52 origin-top-right rounded-xl border border-white/5 bg-gray-900 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              {timeDropdownData.map((data) => (
                <MenuItem key={data.value}>
                  <button
                    className="z-10 group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                    onClick={() => {
                      setGranularity(data);
                    }}
                  >
                    {data.label}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        <CandleChart
          ref={chartRef}
          loading={isCandleChartLoading}
          data={convertedProductCandle}
        />
      </div>
    </div>
  );
}
