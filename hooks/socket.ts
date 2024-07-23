import { generateSubscribeMessage } from "@/utils/signature";
import { DependencyList, useEffect, useRef } from "react";

const sockets: { [url: string]: WebSocket } = {};

interface IProps {
  productId: string;
  onMessage?: (data: TSocketChannelResponse) => void;
  url?: string;
}

export function useCoinbaseSocket(
  {
    productId = "",
    onMessage = () => {},
    url = process.env.NEXT_PUBLIC_COINBASE_WS_FEED_SANDBOX_URL || "",
  }: IProps,
  deps: DependencyList = [],
) {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = async () => {
      const subscribeMessage = await generateSubscribeMessage(productId);

      if (
        sockets[url]?.readyState === WebSocket.OPEN ||
        sockets[url]?.readyState === WebSocket.CONNECTING
      )
        return;

      socket.current = sockets[url] = new WebSocket(url);

      // Connection opened
      socket.current.addEventListener("open", () => {
        socket.current?.send(JSON.stringify(subscribeMessage));
      });

      // Listen for messages
      socket.current.addEventListener(
        "message",
        (event: MessageEvent<string>) => {
          onMessage(JSON.parse(event.data));
        },
      );
    };

    connect();

    return () => {
      socket.current?.close();
      delete sockets[url];
    };
  }, deps);
}
