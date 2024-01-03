const React = require('react');

export class SmartCreate {
  store = {};
  listeners = new Set<() => void>();

  constructor(createSlice: (a: (partial: any) => void, b: () => {}) => {}) {
    this.subscribe = this.subscribe.bind(this);
    this.getState = this.getState.bind(this);
    this.setState = this.setState.bind(this);
    this.emitChange = this.emitChange.bind(this);
    this.listen = this.listen.bind(this);
    this.shallow = this.shallow.bind(this);
    this.store = createSlice(this.setState, this.getState);
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState() {
    return this.store;
  }

  setState(partial: <T>(_s: T) => {} | {}) {
    const nextState =
      typeof partial === 'function' ? partial(this.store) : partial;
    if (!Object.is(nextState, this.store)) {
      this.store =
        typeof nextState !== 'object' || nextState === null
          ? nextState
          : Object.assign({}, this.store, nextState);
      this.emitChange();
    }
  }

  emitChange() {
    this.listeners.forEach((listener) => listener());
  }

  listen<T extends (...args: any) => any>(callback: T) {
    const _s = React.useSyncExternalStore(
      this.subscribe,
      callback ? () => callback(this.store) : this.getState
    );
    return typeof callback === 'function' ? callback(this.store) : _s;
  }

  check(objA: Record<string, unknown>, objB: Record<string, unknown>) {
    if (Object.is(objA, objB)) {
      return true;
    }
    if (
      typeof objA !== 'object' ||
      objA === null ||
      typeof objB !== 'object' ||
      objB === null
    ) {
      return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (let i = 0; i < keysA.length; i++) {
      if (
        !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
        !Object.is(objA[keysA[i]], objB[keysA[i]])
      ) {
        return false;
      }
    }
    return true;
  }

  shallow(selector: <T extends (...args: any) => any>(_a: T) => ReturnType<T>) {
    var prev = React.useRef();
    const check = this.check;
    return function <T extends (...args: any) => any>(state: T) {
      var next = selector(state);
      return check(prev.current, next) ? prev.current : (prev.current = next);
    };
  }
}
