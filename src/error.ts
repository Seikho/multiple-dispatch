export class AmbiguousError extends Error { }
export class NoMatchError extends Error { }
export class InvalidOverride extends Error { }
export class InsufficientTypes extends Error { }

export type ErrorUnion = typeof AmbiguousError
    | typeof NoMatchError
    | typeof InvalidOverride
    | typeof InsufficientTypes
