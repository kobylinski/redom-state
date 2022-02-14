const { defaultState, up, down, wire, pick, app, run } = require("./state");

beforeAll(() => {
  window.requestAnimationFrame = (cb) => cb();
});

describe("RedomState as a module", () => {
  test("init state", () => {
    const app = {
      update: jest.fn(),
    };
    run(app);
    expect(app.update).toHaveBeenCalledWith(defaultState);
  });
  test("Run predefined wired functions", () => {
    const app = {
      update: jest.fn(),
    };
    run(app);
    up();
    down();
    expect(app.update).toHaveBeenNthCalledWith(2, { counter: 2 });
    expect(app.update).toHaveBeenNthCalledWith(3, { counter: 1 });
  });
  test("Define additional wired function", () => {
    const localUp = wire((state, step) => ({
      counter: state.counter + step,
    }));
    const app = {
      update: jest.fn(),
    };
    run(app);
    localUp(2);
    expect(app.update).toHaveBeenNthCalledWith(2, { counter: 3 });
  });
  test("Define additional pick function", () => {
    const counter = pick((state) => state.counter);
    run({ update: () => {} });
    expect(counter()).toBe(1);
    up();
    expect(counter()).toBe(2);
  });
  test("Expose app instance", () => {
    const newApp = { update: jest.fn() };
    run(newApp);
    app().update("test");
    expect(newApp.update).toHaveBeenNthCalledWith(2, "test");
  });
});
