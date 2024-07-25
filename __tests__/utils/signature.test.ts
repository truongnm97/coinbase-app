import crypto from "crypto";
import { generateSubscribeMessage, generateSignature } from "@/utils/signature";

describe("generateSignature", () => {
  const originalEnv = process.env;
  const mockDate = new Date("2023-01-01T00:00:00Z");

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    jest.spyOn(global.Date, "now").mockImplementation(() => mockDate.getTime());
  });

  afterAll(() => {
    process.env = originalEnv;
    jest.spyOn(global.Date, "now").mockRestore();
  });

  test("generates a valid signature for a GET request without data", async () => {
    const secretkey = "c2VjcmV0a2V5";
    process.env.COINBASE_SECRET_KEY = secretkey; // base64 for 'secretkey'

    const { signature, timestamp } = await generateSignature("/test", "GET");

    const expectedMessage = `${timestamp}GET/test`;
    const expectedKey = Buffer.from(secretkey, "base64");
    const expectedHmac = crypto
      .createHmac("sha256", expectedKey)
      .update(expectedMessage)
      .digest("base64");

    expect(signature).toBe(expectedHmac);
    expect(timestamp).toBe(Math.floor(mockDate.getTime() / 1000));
  });

  test("generates a valid signature for a POST request with data", async () => {
    const secretkey = "c2VjcmV0a2V5";
    process.env.COINBASE_SECRET_KEY = secretkey; // base64 for 'secretkey'

    const data = { key: "value" };
    const { signature, timestamp } = await generateSignature(
      "/test",
      "POST",
      data,
    );

    const expectedMessage = `${timestamp}POST/test${JSON.stringify(data)}`;
    const expectedKey = Buffer.from(secretkey, "base64");
    const expectedHmac = crypto
      .createHmac("sha256", expectedKey)
      .update(expectedMessage)
      .digest("base64");

    expect(signature).toBe(expectedHmac);
    expect(timestamp).toBe(Math.floor(mockDate.getTime() / 1000));
  });

  test("handles missing COINBASE_SECRET_KEY environment variable", async () => {
    process.env.COINBASE_SECRET_KEY = "";

    const { signature, timestamp } = await generateSignature("/test", "GET");

    const expectedMessage = `${timestamp}GET/test`;
    const expectedKey = Buffer.from("", "base64");
    const expectedHmac = crypto
      .createHmac("sha256", expectedKey)
      .update(expectedMessage)
      .digest("base64");

    expect(signature).toBe(expectedHmac);
    expect(timestamp).toBe(Math.floor(mockDate.getTime() / 1000));
  });
});

describe("generateSubscribeMessage", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      COINBASE_API_KEY: "test_api_key",
      COINBASE_PASSPHRASE: "test_passphrase",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("generates a valid subscribe message", async () => {
    const productId = "BTC-USD";
    const subscribeMessage = await generateSubscribeMessage(productId);
    const { signature, timestamp } =
      await generateSignature("/users/self/verify");

    const expectedMessage = {
      type: "subscribe",
      channels: [
        { name: "level2", product_ids: [productId] },
        { name: "matches", product_ids: [productId] },
      ],
      signature,
      key: "test_api_key",
      passphrase: "test_passphrase",
      timestamp,
    };

    expect(subscribeMessage).toEqual(expectedMessage);
  });

  test("handles missing COINBASE_API_KEY and COINBASE_PASSPHRASE environment variables", async () => {
    delete process.env.COINBASE_API_KEY;
    delete process.env.COINBASE_PASSPHRASE;

    const productId = "BTC-USD";
    const subscribeMessage = await generateSubscribeMessage(productId);
    const { signature, timestamp } =
      await generateSignature("/users/self/verify");

    const expectedMessage = {
      type: "subscribe",
      channels: [
        { name: "level2", product_ids: [productId] },
        { name: "matches", product_ids: [productId] },
      ],
      signature,
      key: undefined,
      passphrase: undefined,
      timestamp,
    };

    expect(subscribeMessage).toEqual(expectedMessage);
  });
});
