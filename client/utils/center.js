const gridSize = 50

export default function center(origin, nItems) {
    // the final list of points
    const points = []

    const nTop = Math.floor(nItems / 2)

    // add the points above the origin
    for (let i = nTop; i > 0; i--) {
        points.push({
            x: origin.x,
            y: origin.y - i * gridSize,
        })
    }

    // if there is an odd number
    if (nItems % 2) {
        // we have to add a point in the middle
        points.push({
            x: origin.x,
            y: origin.y,
        })
    }

    // add the points below the origin
    for (let i = 1; i <= nTop; i++) {
        points.push({
            x: origin.x,
            y: origin.y + i * gridSize,
        })
    }

    // we're done here
    return points
}
