const { RedomState } = require("../dist/redom-state");
const defaultState = { counter: 1 };
const state = new RedomState(null, () => defaultState);
const up = state.wire((state) => ({
  counter: state.counter + 1,
}));
const down = state.wire((state) => ({
  counter: state.counter - 1,
}));
const { wire, pick, run, app } = state.export();

module.exports = {
  defaultState,
  up,
  down,
  wire,
  pick,
  run,
  app,
};
