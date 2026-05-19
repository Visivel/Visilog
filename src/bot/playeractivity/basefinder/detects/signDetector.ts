import { basefinderTipos } from "../basefinderTypes"
import { blockEntity, lerBlocos } from "../utils/blockEntity"

export class signDetector{
    constructor(private readonly leitor = new blockEntity()){}

    detect(bloco: lerBlocos){
        const nome = bloco.nome.toLowerCase()

        if(!nome.includes('sign')) return null
        if(!this.leitor.temTexto(bloco)) return null

        return {
            tipo: 'written_sign' as basefinderTipos,
            score: 3
        }
    }
}
