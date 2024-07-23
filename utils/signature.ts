"use server";
import crypto from "crypto";

export async function generateSignature(
  requestPath = "",
  method = "GET",
  data: any = null,
) {
  const timestamp = Math.floor(Date.now() / 1000);
  const secret = process.env.COINBASE_SECRET_KEY || "";
  const body = data ? JSON.stringify(data) : "";

  // create the prehash string by concatenating required parts
  const message = timestamp + method + requestPath + body;

  // decode the base64 secret
  const key = Buffer.from(secret, "base64");

  // create a sha256 hmac with the secret
  const hmac = crypto.createHmac("sha256", key);

  // sign the require message with the hmac and base64 encode the result
  const signature = hmac.update(message).digest("base64");

  return { signature, timestamp };
}

export async function generateSubscribeMessage(productId: string) {
  const { signature, timestamp } =
    await generateSignature("/users/self/verify");
  const subscribeMessage = {
    type: "subscribe",
    channels: [
      { name: "level2", product_ids: [productId] },
      {
        name: "matches",
        product_ids: [productId],
      },
    ],
    signature,
    key: process.env.COINBASE_API_KEY,
    passphrase: process.env.COINBASE_PASSPHRASE,
    timestamp,
  };

  return subscribeMessage;
}
