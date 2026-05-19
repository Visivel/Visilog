import { chunkScore } from "../utils/chunkScore";

export class susDetector{
    constructor(private scores: chunkScore){}

    // ඞ
    isSus(chunkX: number, chunkZ: number){
        const chave = `${chunkX}:${chunkZ}`

        const score = this.scores.get(chave)

        return score >= 20
    }
}