# State management made for redom apps


## Define components provides state actions

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
import {el, text} from "redom";
import Counter, { set } from "./Counter";

export default class App {
  constructor() {
    this.el = el('.app',
      this.value = el('input.value', {type:'text'}),
      this.counter = new Counter(),
      this.reset = el('button.reset', text("reset"))
    );
    this.reset.onclick = e => set(0);
  }

  update(state) {
    this.value.value = state.value
  }
}
```

## Bootstrap application

```js
// bootstrap.js
import state from "redom-state"
import { mount } from "redom"
import App from "./App"

state(mount(document.body, new App()), () => {
  return {
    value: 0,
  };
});

```