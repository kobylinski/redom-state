import RedomState from "./RedomState";

let defState = new RedomState();

export default (app, bootstrap = () => ({})) => {
  defState.app = app;
  defState.state = bootstrap();
};

const wire = (callback) => defState.wire(callback);
const pick = (...args) => defState.pick(...args);

export { wire, pick, RedomState };
