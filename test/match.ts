import fixtures, { MatchFixture } from './fixtures/match';
import { expect } from 'chai';
import match from '../src/match';

describe('Match', () => {
    for (const fixture of fixtures) {
        describe(`::${fixture.name}`, () => {
            it(
                'will match as expected',
                () => testMatch(fixture, false)
            );

            it(
                'will throw the expected errors',
                () => testMatch(fixture, true)
            );
        });
    }
});

function testMatch(fixture: MatchFixture, throwSetting: boolean) {
    const dispatchers = fixture.handlers;
    const options: any = { throw: throwSetting, name: fixture.name, params: fixture.params };

    for (const assertion of fixture.assertions) {
        const types = assertion.in.split('');
        try {
            const actual = match(types, dispatchers, options);
            const expected = isError(assertion.out) ? null : assertion.out;
            expect(actual).to.equal(expected);
        } catch (ex) {
            expect(throwSetting, 'only throw when configured to').to.equal(true);
            expect(ex.constructor.name, 'throw the correct error class').to.equal(assertion.out.name);
        }
    }
}

function isError(value: any): value is typeof Error {
    if (value.name === 'Error') {
        return true;
    }
    if (value.prototype) {
        return isError(value.prototype);
    }
    return false;
}