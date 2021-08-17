import RedomState from "./RedomState";

let defState;

export default (app, bootstrap) => {
  defState = new RedomState(app, bootstrap);
};

const wire = (callback) => defState.wire(callback);
const pick = (callback) => defState.pick(callback);

export { wire, pick, RedomState };
