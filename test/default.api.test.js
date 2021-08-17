const { default: state, wire, pick } = require("../dist/redom-state");
beforeAll(() => {
  window.requestAnimationFrame = (cb) => cb();
});
test("Default api", () => {
  const increment = wire((state) => ({ value: state.value + 1 }));
  const currentValue = pick((state) => state.value, true);
  state({ update() {} }, () => ({ value: 1 }));
  expect(currentValue()).toEqual(1);
  increment();
  expect(currentValue()).toEqual(2);
});
