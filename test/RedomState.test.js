const { RedomState } = require("../dist/redom-state");

const defaultApp = { update() {} };
const defaultBootstrap = () => ({ value: 1 });
const getState = (app = defaultApp, bootstap = defaultBootstrap) =>
  new RedomState(app, bootstap);

beforeAll(() => {
  window.requestAnimationFrame = (cb) => cb();
});

const sleep = (ms, payload) =>
  new Promise((done) => setTimeout(() => done(payload), ms));

describe("RedomState", () => {
  test("init state", () => {
    const state = getState();
    expect(state.state.value).toEqual(1);
  });

  test("async bootstrap", () => {
    expect.assertions(6);
    return new Promise((done) => {
      const state = getState(
        {
          counter: 0,
          update(state) {
            switch (this.counter++) {
              case 0:
                expect(state.state).toEqual("loading");
                expect(state.progress).toEqual(0);
                break;
              case 1:
                expect(state.progress).toEqual(66);
                break;
              case 2:
                expect(state.progress).toEqual(100);
                break;
              default:
                expect(state.state).toEqual("done");
                expect(state.progress).toEqual(100);
                done();
                break;
            }
          },
        },
        () => [
          { state: "loading", progress: 0 },
          sleep(100, { progress: 66 }),
          sleep(50, { progress: 100 }),
          { state: "done" },
        ]
      );
    });
  });

  test("generator bootstrap", () => {
    expect.assertions(5);
    return new Promise((done) => {
      getState(
        {
          counter: 0,
          update(state) {
            switch (this.counter++) {
              case 0:
                expect(state.state).toEqual("loading");
                expect(state.progress).toEqual(0);
                break;
              case 1:
                expect(state.progress).toEqual(50);
                break;
              default:
                expect(state.state).toEqual("done");
                expect(state.progress).toEqual(100);
                done();
                break;
            }
          },
        },
        async function* () {
          yield { state: "loading", progress: 0 };
          yield await sleep(100, { progress: 50 });
          yield await sleep(100, { progress: 100, state: "done" });
        }
      );
    });
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
