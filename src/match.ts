import { DispatchHandler, DispatchOptions } from './types';
import * as Errors from './error';

export default function findMatch<TReturn, TDispatch>(
    types: TDispatch[],
    dispatchers: DispatchHandler<TReturn, TDispatch>[],
    options: DispatchOptions<TDispatch>,
    throwOverride?: boolean
) {
    const willThrow = throwOverride !== undefined ? throwOverride : options.throw;
    if (!options.ignoreArity && types.length !== options.params.length) {
        // Is this expected? Should we offer some default behaviour here?
        if (options.throw) {
            throw new Errors.InvalidTypeCount('Invalid number of type arguments provided');
        }
        return null;
    }

    const results: { matches: number, dispatcher: DispatchHandler<TReturn, TDispatch> }[] = [];
    for (const dispatcher of dispatchers) {
        let matches = 0;
        let typeIndex = 0;
        for (const type of types) {
            const isa = options.params[typeIndex].isa || ((special, general) => special === general);
            const dispatchType = dispatcher.types[typeIndex++];
            if (isa(type, dispatchType)) {
                matches++;
            }
        }
        results.push({ matches, dispatcher });
    }

    const max = Math.max(...results.map(result => result.matches));
    const maxMatches = results.filter(result => result.matches === max);
    if (max === 0) {
        if (willThrow) {
            throw new Errors.NoMatchError(`No match found for types [${types.toString()}]`);
        }
        return null;
    }
    
    if (max !== types.length) {
        if (willThrow) {
            throw new Errors.AmbiguousError(`Specific match not found [${types.toString()}]`);
        }
        return null;
    }

    if (maxMatches.length > 1) {
        // This should no longer occur as this is caught when adding overrides
        if (willThrow) {
            throw new Errors.AmbiguousError(`Multiple matches found fore types [${types.toString()}]`);
        }
        return null;
    }
    return maxMatches[0].dispatcher.handler(...types);
}
