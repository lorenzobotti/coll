import { s } from './lib';
import { MsgToWorker } from './types.ts';

// if (!window.Worker) {
//     throw new Error('Web Workers are not supported in this environment');
// }

onmessage = async (mess) => {
    console.log('message received')

    const { width, height, subdivisions, data } = mess.data as MsgToWorker

    // const i = document.createElement('img')
    // i.src = uri
    // await new Promise(res => i.addEventListener('load', res, { once: true }))

    const ofc = new OffscreenCanvas(width, height)
    const c = ofc.getContext('2d')!

    // const data = c.getImageData(0, 0, i.width, i.height)

    s(c, data, width, height, subdivisions)

    const bitmap = ofc.transferToImageBitmap()

    postMessage({ bitmap }, [bitmap])
}