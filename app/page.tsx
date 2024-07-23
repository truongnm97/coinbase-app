import { getProducts, getProductsStats } from "@/apis/products";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();
  const productStats = await getProductsStats();

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-white text-xl font-bold sm:text-2xl">
            Coinbase Exchange
          </h3>
          <p className="text-gray-600 mt-2">
            US based institutional trading platform. Connect to Coinbase's
            global liquidity pool with trading UI, FIX API and REST API.
          </p>
        </div>
      </div>
      <div className="mt-12 relative h-max overflow-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="text-gray-500 font-medium border-b">
            <tr>
              <th className="py-3 pr-6">Market</th>
              <th className="py-3 pr-6 text-right">Price</th>
              <th className="py-3 pr-6 text-right">Change</th>
              <th className="py-3 pr-6 text-right">24H Volume</th>
              <th className="py-3 pr-6 text-right">30D Volume</th>
              <th className="py-3 pr-6"></th>
            </tr>
          </thead>
          <tbody className="text-white divide-y">
            {products
              .filter((item) => item.status === "online")
              .sort((a, b) => {
                if (productStats == null) return 0;
                const aStats = productStats[a.id]?.stats_24hour || {};
                const bStats = productStats[b.id]?.stats_24hour || {};
                return (
                  Number(bStats.volume) * Number(bStats.last) -
                  Number(aStats.volume) * Number(aStats.last)
                );
              })
              .map((item) => {
                const stats = productStats?.[item.id] || {};
                const last = Number(stats.stats_24hour.last);
                const open = Number(stats.stats_24hour.open);
                const volume24h = Number(stats.stats_24hour.volume);
                const volume30d = Number(stats.stats_30day.volume);
                const change = ((last - open) / open) * 100;
                return (
                  <tr key={item.id} className="hover:bg-gray-900">
                    <td className="flex items-center gap-x-3 py-3 pr-6 whitespace-nowrap">
                      <div>
                        <span className="block text-white text-sm font-medium">
                          {item.display_name}
                        </span>
                        <span className="block text-gray-700 text-xs">
                          {item.cancel_only
                            ? "Cancel Only"
                            : item.limit_only
                              ? "Limit Only"
                              : item.auction_mode
                                ? "Auction Mode"
                                : "Full Trading"}
                        </span>
                      </div>
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap text-right">
                      {last}
                    </td>
                    <td
                      className={`pr-6 py-4 whitespace-nowrap text-right ${change > 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {isNaN(change) ? "" : `${+Math.abs(change).toFixed(2)}%`}
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap text-right">
                      {`$${(volume24h * last).toLocaleString()}`}
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap text-right">
                      {`$${(volume30d * last).toLocaleString()}`}
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <Link
                        href={item.id}
                        className="w-fit inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
                      >
                        <span className="material-symbols-rounded">
                          monitoring
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
