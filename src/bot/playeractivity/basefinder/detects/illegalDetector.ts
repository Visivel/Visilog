import { basefinderTipos } from "../basefinderTypes";
import { naturalFilter } from "../utils/naturalFilter";

export class illegalDetector{
    constructor(private readonly filter = new naturalFilter()) {}
    detect(nome: string, y: number){
        const n = nome.toLowerCase()

        // se o server for da 1.18 ou tiver chunks geradas antes da 1.18, mude y >= 4 (eu acho)
        if(n === 'bedrock' && y >= -59){
            return {
                tipo: 'bedrock' as basefinderTipos,
                score: 15
            }
        }
        // if(n=== 'mob_spawner' || n==='spawner'){
        //     return{
        //         tipo: 'spawner' as basefinderTipos,
        //         score: 20
        //     }
        // }
        return null
    }
}