import { basefinderTipos } from "../basefinderTypes";

export class storageDetector{
    detect(nome: string){
        const n = nome.toLowerCase()

        if(
            n.includes('chest') ||
            n.includes('barrel') ||
            n.includes('shulker') ||
            n.includes('hopper') ||
            n.includes('dispenser') ||
            n.includes('dropper')
        ){
            return {
                tipo: 'storage' as basefinderTipos,
                score: 6
            }
        }
        return null
    }
}