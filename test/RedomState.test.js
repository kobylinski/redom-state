const { RedomState } = require("../dist/redom-state");

const defaultApp = { update() {} };
const defaultBootstrap = () => ({ value: 1 });
const getState = (app = defaultApp, bootstap = defaultBootstrap) =>
  new RedomState(app, bootstap);

beforeAll(() => {
  window.requestAnimationFrame = (cb) => cb();
});

describe("RedomState", () => {
  test("init state", () => {
    const state = getState();
    expect(state.state.value).toEqual(1);
  });

  test("wire", () => {
    const state = getState();
    const increment = state.wire((state) => ({ value: state.value + 1 }));
    increment();
    expect(state.state.value).toEqual(2);
  });

  test("pick - no cache", () => {
    const state = getState();
    const increment = state.wire((state) => ({ value: state.value + 1 }));
    const getter = (state) => state.value;
    const currentValueNoCache = state.pick(getter);
    expect(currentValueNoCache()).toEqual(1);
    increment();
    expect(currentValueNoCache()).toEqual(2);
  });

  test("pick - context cache", () => {
    const state = getState();
    const increment = state.wire((state) => ({ value: state.value + 1 }));
    const getter = (state) => state.value;
    const currentValueContextCacheKey = state.pick(getter, true);
    expect(currentValueContextCacheKey()).toEqual(1);
    expect(state.cache.has(getter)).toBeTruthy();
    increment();
    expect(state.cache.has(getter)).toBeFalsy();
    expect(currentValueContextCacheKey()).toEqual(2);
  });

  test("pick - named cache", () => {
    const state = getState();
    const increment = state.wire((state) => ({ value: state.value + 1 }));
    const getter = (state) => state.value;
    const KEY = "custom_getter_cache_key";
    const currentValueNamedCacheKey = state.pick(getter, (...args) => KEY);
    expect(currentValueNamedCacheKey()).toEqual(1);
    expect(state.cache.has(KEY)).toBeTruthy();
    increment();
    expect(state.cache.has(KEY)).toBeFalsy();
    expect(currentValueNamedCacheKey()).toEqual(2);
  });
});
