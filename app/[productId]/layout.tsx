import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Product',
  description: "Coinbase Exchange Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
