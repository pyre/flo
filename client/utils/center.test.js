import { center } from '.'

test('centers even ranges', () => {
    expect(center({ x: 0, y: 0 }, 2)).toEqual([{ x: 0, y: -50 }, { x: 0, y: 50 }])
})

test('centers odd range', () => {
    expect(center({ x: 0, y: 0 }, 3)).toEqual([{ x: 0, y: -100 }, { x: 0, y: 0 }, { x: 0, y: 100 }])
})
