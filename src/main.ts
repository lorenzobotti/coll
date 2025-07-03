import '@exampledev/new.css'
import { MsgFromWorker } from './types'

const canvas = document.getElementById('c') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

const fileI = document.getElementById('file-input') as HTMLInputElement
const subdivisionsI = document.getElementById('subd') as HTMLInputElement
const widthI = document.getElementById('width') as HTMLInputElement
const heightI = document.getElementById('height') as HTMLInputElement

const submitBtn = document.getElementById('submit-btn') as HTMLInputElement
const downloadBtn = document.getElementById('download-btn') as HTMLInputElement

submitBtn.addEventListener('click', main) // TODO

const img = document.getElementById('i') as HTMLImageElement
// img.addEventListener('load', main)

async function main() {
    const { width, height, subdivisions, file } = parseForm()
    const { uri, data } = await imageDataFromFile(file, width, height)
    
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    worker.postMessage({ width, height, subdivisions, data }, [data.data.buffer])

    const mess: MsgFromWorker = await new Promise(res => worker.addEventListener('message', e => res(e.data as MsgFromWorker), { once: true }))
    worker.terminate()

    console.log({ mess })

    ctx.drawImage(mess.bitmap, 0, 0, width, height)
    downloadBtn.disabled = false
    downloadBtn.addEventListener('click', () => { 
        const image = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = image;
        link.download = 'canvas.png';
        link.click();
     })
}

function parseForm() {
    const width = widthI.valueAsNumber
    const height = heightI.valueAsNumber
    const subdivisions = subdivisionsI.valueAsNumber
    
    const file = fileI.files?.[0]
    if (!file) {
        throw new Error('No file selected')
    }
    
    return {
        width,
        height,
        subdivisions,
        file,
    }
}

async function imageDataFromFile(f: File, width: number, height: number) {
    const uri = URL.createObjectURL(f)

    const i = document.createElement('img')
    i.src = uri
    await new Promise(res => i.addEventListener('load', res, { once: true }))

    const ofc = new OffscreenCanvas(i.width, i.height)
    const c = ofc.getContext('2d')!

    c.drawImage(i, 0, 0, width, height)
    const data = c.getImageData(0, 0, width, height)

    return { uri, data }
}