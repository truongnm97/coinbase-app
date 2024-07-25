import { encodeArray, encodeObject, encodeQueryParams } from "@/utils/encoding";

describe("encodeArray", () => {
  test("encodes an array with mixed types", () => {
    const result = encodeArray("mixed", ["string", 123, true]);
    expect(result).toBe("mixed[]=string&mixed[]=123&mixed[]=true");
  });

  test("encodes an array of objects", () => {
    const result = encodeArray("objects", [{ a: 1 }, { b: "two" }]);
    expect(result).toBe(
      "objects[]=%7B%22a%22%3A1%7D&objects[]=%7B%22b%22%3A%22two%22%7D",
    );
  });
});

describe("encodeObject", () => {
  test("encodes an object with mixed types", () => {
    const result = encodeObject("mixed", {
      string: "string",
      number: 123,
      boolean: true,
    });
    expect(result).toBe(
      "mixed[string]=string&mixed[number]=123&mixed[boolean]=true",
    );
  });

  test("encodes an object with nested objects", () => {
    const result = encodeObject("nested", { a: { b: 2 } });
    expect(result).toBe("nested[a]=%7B%22b%22%3A2%7D");
  });
});

describe("encodeQueryParams", () => {
  test("encodes an object with simple key-value pairs", () => {
    const result = encodeQueryParams({ a: 1, b: "string", c: true });
    expect(result).toBe("a=1&b=string&c=true");
  });

  test("encodes an object with mixed types", () => {
    const result = encodeQueryParams({
      string: "string",
      number: 123,
      boolean: true,
      array: [1, 2],
      object: { key: "value" },
    });
    expect(result).toBe(
      "string=string&number=123&boolean=true&array[]=1&array[]=2&object[key]=value",
    );
  });

  test("encodes an empty object", () => {
    const result = encodeQueryParams({});
    expect(result).toBe("");
  });
});
