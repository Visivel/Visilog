import { basefinderTipos } from "../basefinderTypes";

export class portalDetector{
    detect(nome: string){
        const n = nome.toLowerCase()

        if(
            n === 'nether_portal' ||
            n === 'end_portal' ||
            n === 'end_gateway'
        ){
            return {
                tipo: 'open_portal' as basefinderTipos,
                score: 8
            }
        }
        return null
    }
}