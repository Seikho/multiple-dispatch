export interface DispatchOptions<TDispatch> {
  name: string
  params: Array<{ name: string; isa?: (special: TDispatch, general: TDispatch) => boolean }>
  throw?: boolean
  ignoreArity?: boolean
}

export interface Dispatcher<TReturn, TDispatch> {
  name: string
  override(types: TDispatch[], callback: (...types: TDispatch[]) => TReturn): boolean
  dispatch(...types: TDispatch[]): TReturn | null
}

export interface DispatchHandler<TReturn, TDispatch> {
  types: TDispatch[]
  handler: (...types: TDispatch[]) => TReturn
}
