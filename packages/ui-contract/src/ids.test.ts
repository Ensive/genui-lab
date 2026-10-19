import { describe, expect, it } from "vitest";
import { assertStableId } from "./ids.js";

describe("assertStableId", () => {
  it("accepts namespaced semantic ids", () => {
    expect(() => assertStableId("metric:battery-temp-max")).not.toThrow();
    expect(() => assertStableId("chart:battery-temperature")).not.toThrow();
    expect(() => assertStableId("alert:temperature-anomaly-001")).not.toThrow();
  });

  it("rejects bare indexes and unnamespaced ids", () => {
    expect(() => assertStableId("0")).toThrow();
    expect(() => assertStableId("metric:0")).toThrow();
  });
});
