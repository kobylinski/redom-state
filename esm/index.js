import RedomState from "./RedomState";

let defState = new RedomState();

export default (app, bootstrap = () => ({})) => defState.run(app, bootstrap);
const wire = (callback) => defState.wire(callback);
const pick = (...args) => defState.pick(...args);
const app = () => defState.app;

export { wire, pick, app, RedomState };
