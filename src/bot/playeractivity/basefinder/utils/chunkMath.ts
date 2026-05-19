export function toChunk(coord: number){
    return Math.floor(coord/16)
}

export function chunkPos(x: number, z: number){
    return {
        chunkX: toChunk(x),
        chunkZ: toChunk(z)
    }
}