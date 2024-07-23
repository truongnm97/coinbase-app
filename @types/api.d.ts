interface IResponse<T = any> {
  data?: T;
  status?: number;
  code?: string;
  message?: string;
}

interface IError {
  error: string;
  message: string;
  statusCode: number;
}

interface IResponseError {
  response: IResponse<IError>;
}

interface IRequestProps<T> extends RequestInit {
  data?: T;
}
interface IPostResponse {
  userId?: string;
  id?: string;
  title?: string;
  body?: string;
}

interface IPostRequest {
  userId?: string;
  id?: string;
  title?: string;
  body?: string;
}

interface IFetcherRequest {
  queryConfig?: import("@tanstack/react-query").QueryOptions<any>;
}

interface ILoginResponse {
  access_token: string;
}

interface IResponsePagination<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

interface IProduct {
  id: string;
  base_currency: string;
  quote_currency: string;
  quote_increment: string;
  base_increment: string;
  display_name: string;
  min_market_funds: string;
  margin_enabled: boolean;
  post_only: boolean;
  limit_only: boolean;
  cancel_only: boolean;
  status: "online" | "offline" | "internal" | "delisted";
  status_message: string;
  trading_disabled: boolean;
  fx_stablecoin: boolean;
  max_slippage_percentage: string;
  auction_mode: boolean;
  high_bid_limit_percentage: string;
}

interface IProductStats {
  stats_30day: {
    volume: string;
    rfq_volume: string;
  };
  stats_24hour: {
    open: string;
    high: string;
    low: string;
    last: string;
    volume: string;
    rfq_volume: string;
  };
}

interface IProductCandleParams {
  start?: string;
  end?: string;
  granularity?: 60 | 300 | 900 | 3600 | 21600 | 86400;
}

type TProductCandle = [
  time: number,
  low: number,
  high: number,
  open: number,
  close: number,
  volume: number,
];

interface ISocketChannelLevel2Response {
  type: "l2update";
  product_id: string;
  time: string;
  changes: ["buy" | "sell", string, string][];
}

interface ISocketChannelSnapshotResponse {
  type: "snapshot";
  product_id: string;
  bids: [number, number][];
  asks: [number, number][];
}

interface ISocketChannelMatchResponse {
  type: "match";
  trade_id: number;
  sequence: number;
  maker_order_id: string;
  taker_order_id: string;
  time: string;
  product_id: string;
  size: string;
  price: string;
  side: "sell" | "buy";
}

type TSocketChannelResponse =
  | ISocketChannelMatchResponse
  | ISocketChannelSnapshotResponse
  | ISocketChannelLevel2Response;
