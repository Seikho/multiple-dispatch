import { DispatchHandler, DispatchOptions } from './types';
import findMatch from './match';
import * as Errors from './error';

export default function addOverride<TReturn, TDispatch>(
    types: TDispatch[],
    handler: (...types: TDispatch[]) => TReturn,
    dispatchers: DispatchHandler<TReturn, TDispatch>[],
    options: DispatchOptions<TDispatch>
) {
    if (options.params.length !== types.length) {
        if (options.throw) {
            throw new Errors.InvalidOverride(`Insufficient type parameters provided. Expected ${options.params.length}, received ${types.length}`);
        }
        return false;
    }
    if (typeof handler !== 'function') {
        if (options.throw) {
            throw new Errors.InvalidOverride('Dispatch handler provided is not a function');
        }
        return false;
    }

    const existingMatch = findMatch(types, dispatchers, options);
    if (existingMatch) {
        if (options.throw) {
            throw new Errors.InvalidOverride(`A match already exists for the provided types. [${types.toString()}]`)
        }
        return false;
    }

    dispatchers.push({ types, handler });
    return true;
}