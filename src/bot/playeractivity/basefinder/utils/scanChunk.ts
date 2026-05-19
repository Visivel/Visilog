import { Vec3 } from "vec3"

export async function scanChunk(
    bot: any,
    chunkX: number,
    chunkZ: number,
    callback: (bloco: any, x: number, y: number, z: number) => void | Promise<void>,
    minY = -64,
    maxY = 319
) {
    await bot.waitForChunksToLoad()

    for (let dx = 0; dx < 16; dx++) {
        for (let dz = 0; dz < 16; dz++) {
            for (let y = minY; y <= maxY; y++) {
                const x = chunkX * 16 + dx
                const z = chunkZ * 16 + dz

                const bloco = bot.blockAt(new Vec3(x, y, z), true)
                if (!bloco) continue

                await callback(bloco, x, y, z)
            }
        }
    }
}