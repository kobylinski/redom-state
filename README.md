# State management made for redom apps

## Install

```sh
yarn add redom-state
// or
npm i redom-state
```

## Usage

### Define your state using default state helper.

```js
import state from "redom-state";
import { mount } from "redom";
import App from "./App";

state(mount(document.body, new App()), () => ({ value: 0 }));
```

### Define your state with async bootstrap.

```js
import state from "redom-state";
import { mount } from "redom";
import App from "./App";

state(mount(document.body, new App()), () => [
  { state: "loading" }, // Setup your init state
  promise1(),
  promise2(),
  { state: "none" },
]);
```

Each elements in array returned by init function will be resolved and merged with state, then application will be updated with new version state. This should helps to manage loaders and progress information.

### Define your state with generator function.

```js
import state from "redom-state";
import { mount } from "redom";
import App from "./App";

state(mount(document.body, new App()), async function* () {
  yield { state: "loading" }; // returns immediately
  const result = await promise1();
  yield result;
  yield await promise2(result); // uses result of previus call
});
```

Generator function is most complex way to bootstrap state. Each `yield` is merged with currend state and application is updated.

### Updating state

Updating state is available through specially defined function using `wire` helper. Each call of this function will update state and triggers application update. Each _wired_ function returns whole new state. It means that on module side there is no merge or diff. All merging should be done by _wired_ function. _Wired_ function should not handle async calls, promises are not resolved. Async update can be done differently.

```js
import { wire } from "redom-state";

const switchPage = wire((state, page) => ({
  ...state,
  page,
}));
```

This example presents simple page switcher. That function can be experted and used across whole app in redom components.

### Fetching chunk of state

State should be passed by update function and received by parrent but sometimes it maight be need to fetch some data directly from state with predefined filter or reducer. Use `pick` function to define special shortcuts to data. As _wired_ function also _pickers_ can be shared accross whole app by export/import module

```js
import { pick } from "redom-state";

// no arguments
const getPage = pick((state) => state.page);

// more arguments
const listPages = pick((state, title, author) => state.pages.filter(page => page.title.includes(title) && page.author.includes(author));
```

Sometimes we want to call this function many times in one cycle, to prevent repeating havy operations you can add information how to build cache key for this call.

```js
const picker = pick(
  (state, title, author) => {},
  (title, author) => `pages-${title}-${author}`
);
```

### Dealing with async calls

For example if you want fetch from server page contents before you show new page.

```js
import { wire, pick } from "redom-state";

// set view state
const setViewState = wire((state, viewState) => ({
  ...state,
  viewState
}));

// stash page object
const stashPage = wire((state, page) => ({
  ...state
  pages: {
    ...pages,
    ...page
  }
}))

// set current page
const setCurrentPage = wire((state, currentPage) => ({
  ...state,
  currentPage
}));

// switch page with conditional assync call
const switchPage = pick((state, page) => {
  if( !state.pages[page] ){
    setViewState("loading");
    fetch(`/pages/${page}`).then(response => response.json()).then( body =>  {
      stashPage({ [page]: body });
      setCurrentPage(page);
      setViewState("ready");
    });
  }else{
    setCurrentPage(page);
  }
});
```

### Define own state object

With helper function also state class is provided. You can define and expose your own state for app.

```js
import { RedomState } from "redom-state"
import { mount } from "redom";
import App from "./App";

const state = new RedomState( mount(document.body, new App()), () => ({ value: 0 }) );
export {
  wire: (fn) => state.wire( fn ),
  pick: (fn, cache = false) => state.pick(fn, cache)
}
```

## Example

```js
// Counter.js
import {wire} from "redom-state";
import {el, text} from "redom";

export const add = wire((state) => ({
  value: state.value + 1
}));

export const sub = wire((state)) => ({
  value: state.value - 1
}));

export const set = wire((state, payload) => ({
  value: payload
}));

export default class Counter {
  constructor() {
    this.el = el('.counter',
      this.add = el('button.add', text("+")),
      this.sub = el('button.sub', text("-"))
    );

    this.add.onclick = e => add();
    this.sub.onclick = e => sub();
  }
  update(){}
}

```

## Define your app class

Reuse previously defined actions

```js
// App.js
import { el, text } from "redom";
import Counter, { set } from "./Counter";

export default class App {
  constructor() {
    this.el = el(
      ".app",
      (this.value = el("input.value", { type: "text" })),
      (this.counter = new Counter()),
      (this.reset = el("button.reset", text("reset")))
    );
    this.reset.onclick = (e) => set(0);
  }

  update(state) {
    this.value.value = state.value;
  }
}
```

## Bootstrap application

```js
// bootstrap.js
import state from "redom-state";
import { mount } from "redom";
import App from "./App";

state(mount(document.body, new App()), () => {
  return {
    value: 0,
  };
});
```
