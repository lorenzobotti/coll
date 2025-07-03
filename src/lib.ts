
export function s(
    c: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    // img: ImageData,
    data: ImageData,
    width: number,
    height: number,
    subdivisions: number,
) {
    // const c = canvas.getContext('2d')!

    // const buffer = new OffscreenCanvas(width, height)
    // const bx = buffer.getContext('2d')!
    // buffer.width = img.width
    // buffer.height = img.height
    // bx.drawImage(img, 0, 0, 1080, 1080)
    // const data = bx.getImageData(0, 0, width, height)

    // c.drawImage(img, 0, 0, width, height)
    // const data = c.getImageData(0, 0, width, height)

    // console.log(data)

    // c.clearRect(0, 0, width, height)

    const widthSubs = Array.from({ length: subdivisions }, (_, i) => i * (width / subdivisions))
    const heightSubs = Array.from({ length: subdivisions }, (_, i) => i * (height / subdivisions))

    const sources = shuffle(pairs(widthSubs, heightSubs))
    const dests = pairs(widthSubs, heightSubs)

    for (const [i, s] of shuffle(sources).entries()) {
        const d = dests[i]
        c.fillRect(d[0], d[1], width / subdivisions - 10, height / subdivisions - 10)

        c.putImageData(data, d[0] - s[0], d[1] - s[1], s[0], s[1], width / subdivisions, height / subdivisions)
    }
}


function pairs<A, B>(a: A[], b: B[]): [A, B][] {
    const out: [A, B][] = []

    for (const i of a) {
        for (const j of b) {
            out.push([i, j])
        }
    }

    return out
}

function shuffle<T>(array: T[]): T[] {
    const result = array.slice()

    for (let i = result.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1))
        const temp = result[i]
        result[i] = result[j]
        result[j] = temp
    }

    return result;
}