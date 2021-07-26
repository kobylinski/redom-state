const registry = {
  state: {},
  app: null,
};

export default (app, bootstrap) => {
  registry.app = app;
  registry.state = bootstrap(actions);
};

export const wire = (callback) => (payload = null) =>
  window.requestAnimationFrame(() => registry.app.update((registry.state = callback(registry.state, payload))));
