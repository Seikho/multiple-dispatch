import { Errors, DispatchHandler } from '../../src'

export type OverrideFixture = {
  name: string
  handlers: Array<DispatchHandler<string, string>>
  params: any
  throws: Errors.ErrorUnion | null
}

const params = [{ name: 'left' }, { name: 'right' }]

const baseHandler = [make('a', 'a'), make('a', 'b'), make('b', 'a'), make('b', 'b')]

const fixtures: Array<OverrideFixture> = [
  {
    name: 'valid',
    params,
    handlers: baseHandler,
    throws: null
  },
  {
    name: 'too many arguments',
    params,
    handlers: [...baseHandler, make('a', 'b', 'c')],
    throws: Errors.InvalidOverride
  },
  {
    name: 'too few arguments',
    params,
    handlers: [...baseHandler, make('a')],
    throws: Errors.InvalidOverride
  },
  {
    name: 'existing match',
    params,
    handlers: [...baseHandler, make('a', 'a')],
    throws: Errors.InvalidOverride
  },
  {
    name: 'handler is not a function',
    params,
    handlers: [...baseHandler, makeBad(['a', 'c'], 'not a function')],
    throws: Errors.InvalidOverride
  }
]

function makeBad(types: string[], handler: any) {
  const dispatcher = make(...types)
  dispatcher.handler = handler
  return dispatcher
}

function make(...types: string[]) {
  return {
    types,
    handler: () => types.join('')
  }
}

export default fixtures
