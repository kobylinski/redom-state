export default class RedomState {
  constructor(app, bootstrap = () => ({})) {
    this.app = app;
    this.state = bootstrap();
    this.cache = new Map();
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
