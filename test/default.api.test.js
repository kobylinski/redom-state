const { default: state, wire, pick } = require("../dist/redom-state");
beforeAll(() => {
  window.requestAnimationFrame = (cb) => cb();
  state({ update() {} }, () => ({ value: 1 }));
});
test("Default api", () => {
  const incremept = wire((state) => ({ value: state.value + 1 }));
  const currentValue = pick((state) => state.value, true);
  expect(currentValue()).toEqual(1);
  incremept();
  expect(currentValue()).toEqual(2);
});
