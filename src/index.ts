import * as Errors from './error';
import findMatch from './match';
import addOverride from './override';
import {
    Dispatcher,
    DispatchOptions,
    DispatchHandler
} from './types';

export default function create<TReturn, TDispatch>(options: DispatchOptions<TDispatch>): Dispatcher<TReturn, TDispatch> {
    /**
     * Default behaviour is to not throw
     */
    options.throw = options.throw || false;
    const dispatchers: Array<DispatchHandler<TReturn, TDispatch>> = [];

    const name = options.name;
    const override = (types: TDispatch[], handler: (...types: TDispatch[]) => TReturn) => {
        return addOverride(types, handler, dispatchers, options);        
    };

    // Find the best match dispatcher and call its handler with the types provided 
    const dispatch = (...types: TDispatch[]): TReturn | null => {
        const match = findMatch(types, dispatchers, options);
        return match;
    };

    return {
        name,
        override,
        dispatch
    };
}

export { Errors }
