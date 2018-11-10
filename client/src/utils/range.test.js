// local imports
import { range } from '.'

test('returns correct array', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4])
})
