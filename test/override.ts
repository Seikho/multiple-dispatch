import fixtures, { OverrideFixture } from './fixtures/override'
import create, { Errors } from '../src'
import { expect } from 'chai'

describe('Override', () => {
  for (const fixture of fixtures) {
    describe(`::${fixture.name}`, () => {
      it('will match as expected', () => testOverride(fixture, false))

      it('will throw the expected errors', () => testOverride(fixture, true))
    })
  }
})

function testOverride(fixture: OverrideFixture, throwSetting: boolean) {
  const options: any = { throw: throwSetting, name: fixture.name, params: fixture.params }
  const dispatcher = create<{}, string>({
    name: fixture.name,
    params: fixture.params,
    throw: throwSetting
  })

  if (!throwSetting) {
    const results: boolean[] = []
    for (const override of fixture.handlers) {
      results.push(dispatcher.override(override.types, override.handler))
    }
    const expected = fixture.throws === null
    const actual = results.every((result) => result === true)
    expect(actual, 'override as expected').to.equal(expected)
    return
  }

  try {
    const results: boolean[] = []
    for (const override of fixture.handlers) {
      results.push(dispatcher.override(override.types, override.handler))
    }
    const expected = fixture.throws === null
    const actual = results.every((result) => result === true)
    expect(actual, 'override as expected').to.equal(expected)
  } catch (ex: any) {
    expect(throwSetting, 'only throw when configured to').to.equal(true)
    const errorConstructor = fixture.throws as Errors.ErrorUnion
    expect(ex.constructor.name, 'throw the correct error class').to.equal(errorConstructor.name)
  }
}

function isError(value: any): value is typeof Error {
  if (value.name === 'Error') {
    return true
  }
  if (value.prototype) {
    return isError(value.prototype)
  }
  return false
}
