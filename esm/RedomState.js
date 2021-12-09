export default class RedomState {
  constructor(app, init = () => ({})) {
    this.app = app;
    this.cache = new Map();
    this.state = {};
    this.bootstrap(init());
  }

  async bootstrap(state) {
    if (
      Array.isArray(state) ||
      typeof state[Symbol.asyncIterator] !== "undefined"
    ) {
      for await (let stage of state) {
        this.app.update((this.state = Object.assign(this.state, stage)));
      }
    } else {
      this.state = state;
      if (this.app) {
        this.app.update(state);
      }
    }
  }

  wire(fn) {
    return (payload = null) => {
      window.requestAnimationFrame(() => {
        this.cache.clear();
        this.app.update((this.state = fn(this.state, payload)));
      });
    };
  }

  pick(fn, cacheKey = false) {
    if (true === cacheKey) {
      return (...args) => {
        if (!this.cache.has(fn)) {
          this.cache.set(fn, fn(this.state, ...args));
        }
        return this.cache.get(fn);
      };
    } else {
      if (false !== cacheKey) {
        return (...args) => {
          const key = cacheKey(...args);
          if (!this.cache.has(key)) {
            this.cache.set(key, fn(this.state, ...args));
          }
          return this.cache.get(key);
        };
      }
    }
    return (...args) => fn(this.state, ...args);
  }
}
