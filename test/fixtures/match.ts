import { Errors, DispatchHandler } from '../../src';

export type MatchFixture = {
    name: string;
    handlers: Array<DispatchHandler<string, string>>;
    params: any;
    assertions: Array<{
        in: string;
        out: any;
    }>
}

const params = [
    { name: 'left' },
    { name: 'right' }
]

const baseHandler = [
    make('a', 'a'),
    make('a', 'b'),
    make('b', 'a'),
    make('b', 'b')
];

const fixtures: Array<MatchFixture> = [
    {
        name: 'valid',
        params,
        handlers: baseHandler,
        assertions: [
            { in: 'aa', out: 'aa' },
            { in: 'ab', out: 'ab' },
            { in: 'ba', out: 'ba' },
            { in: 'bb', out: 'bb' },
        ]
    },
    {
        name: 'no match found',
        params,
        handlers: baseHandler,
        assertions: [
            { in: 'cc', out: Errors.NoMatchError }
        ]
    },
    {
        name: 'specific ambiguous call',
        params,
        handlers: [...baseHandler, make('a', 'a')],
        assertions: [
            { in: 'aa', out: Errors.AmbiguousError }
        ]
    },
    {
        name: 'non-specific ambiguous call',
        params,
        handlers: baseHandler,
        assertions: [
            { in: 'ac', out: Errors.AmbiguousError }
        ]
    }
]

function make(...types: string[]) {
    return {
        types,
        handler: () => types.join('')
    };
}

export default fixtures;