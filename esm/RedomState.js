export default class RedomState {
  constructor(app = null, init = () => ({})) {
    this.app = app;
    this.cache = new Map();
    this.state = {};
    this.init = init;

    if (null !== app) {
      this.bootstrap(init());
    }
  }

  run(app, init = null) {
    if (null !== app) {
      this.app = app;
      this.bootstrap(typeof init === "function" ? init() : this.init(init));
    }
    return this.app;
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

  export() {
    return {
      wire: (fn) => this.wire(fn),
      pick: (fn, cacheKey = false) => this.pick(fn, cacheKey),
      run: (app, init = null) => this.run(app, init),
      app: () => this.app,
    };
  }
}
