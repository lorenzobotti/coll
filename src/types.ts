export interface MsgToWorker {
    width: number,
    height: number,
    subdivisions: number,
    // uri: string,
    data: ImageData,
}

// export interface MsgFromWorker {
//     canvas: OffscreenCanvas,
// }

export interface MsgFromWorker {
    bitmap: ImageBitmap,
}