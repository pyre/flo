// this should be twice the grid size
const spacing = 100

export default function center(origin, nItems) {
    // the final list of points
    const points = []

    const nTop = Math.floor(nItems / 2)
    const isEven = nItems % 2 == 0

    // add the points above the origin
    for (let i = nTop; i > 0; i--) {
        // if there is an even number of points, then we have to bring
        // this down half a spacing to compensate for the lack of middle point
        let y = origin.y - i * spacing
        if (isEven) {
            y += spacing / 2
        }

        // add the point to the list
        points.push({
            x: origin.x,
            y,
        })
    }

    // if there is an odd number
    if (!isEven) {
        // we have to add a point in the middle
        points.push({
            x: origin.x,
            y: origin.y,
        })
    }

    // add the points below the origin
    for (let i = 1; i <= nTop; i++) {
        // if there is an even number of points, then we have to bring
        // this up half a spacing to compensate for the lack of middle point
        let y = origin.y + i * spacing
        if (isEven) {
            y -= spacing / 2
        }

        // add the point to the list
        points.push({
            x: origin.x,
            y,
        })
    }

    // we're done here
    return points
}
