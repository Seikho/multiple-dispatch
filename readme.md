# Multiple Dispatch
Multimethods for JavaScript and Node written in TypeScript

## Installation

```sh
npm install multiple-dispatch --save
```

## Usage
```ts
import multimethod from 'multiple-dispatch';
import homeComponent from './components/home';
import * as store from './components/store';

const double = multimethod({
  name: 'double dispatcher',
  params: [
    {
      name: 'category',
      // This is the default behaviour if you don't have 'isa'
      isa: (specialType: string, generalType: string) => specialType === generalType
    },
    {
      name: 'item',
      isa: (specialType: string, generalType: string) => specialType === generalType
    }
  ],
  throw?: boolean;
});

// The 'types' are passed into the override handler, but don't need to be consumed
double.override(['home', 'main'], (category, item) => homeComponent);
double.override(['store', 'main'], () => store.main);
double.override(['store', 'drills'], () => store.drills);

double.dispatch('store', 'drills'); // Returns store.drills
double.dispatch('home', 'main'); // Returns homeComponent
double.dispatch('home', 'invalid'); // Returns null or throws

function requestHandler(params: { category: string, item: string }) {
  return double.dispatch(params.category, params.item);
}

```

## API

### Create
**Default export**

```ts

import multimethod from 'multiple-dispatch';

function create<TDispatch, TReturn>(options: DispatchOptions): Dispatcher<TDispatch, TReturn>;

interface Dispatcher<TReturn, TDispatch> {
    name: string;
    override(types: TDispatch[], callback: (...types: TDispatch[]) => TReturn): boolean;
    dispatch(...types: TDispatch[]): TReturn | null;
}

interface DispatchOptions<TDispatch> {
    name: string;
    params: Array<{ name: string, isa?: (special: TDispatch, general: TDispatch) => boolean }>;

    // Set to true if the desired behaviour is to throw exceptions with invalid usage or ambiguous dispatches.
    throw?: boolean;
}

interface DispatchHandler<TReturn, TDispatch> {
    types: TDispatch[];
    handler: (...types: TDispatch[]) => TReturn;
}

```


#### isa function

The `isa` property in `DispatchOptions` is for determining if parameter types passed into `dispatch` has a matching
`override` `DisatchHandler`.

During the comparison, the `SPECIAL` types passed into `dispatch(...)` are compared against every set of `GENERAL`
types that exist. These are created when `override(...)` is called.

E.g.:

```ts

// 'home' and 'main' are the GENERAL type during the comparison
// ['home', 'main'] will be added to the DispatchHandler set.
// Every type 'set' that exists will be used during comparison to the find the BEST type match.

double.override(['home', 'main'], handler);

function (category: string, item: string) {

  // category and item are the SPECIAL type
  return double.dispatch(category, item);
}




```

### Dispatcher

Dispatcher instance methods.
These can throw if `throw` is set to `true` in the `DispatchOptions`.

```ts

function override<TReturn, TDispatch>(types: string[], handler: DispatchHandler<TReturn, TDispatch>): boolean;

function dispatch(...types: string[]): TReturn | null;

```


