import { basefinderTipos } from "../basefinderTypes";

export class redstoneDetector{
    detect(nome: string){
        const n = nome.toLowerCase()

        if(n.includes('deepslate_redstone_ore') || n.includes('redstone_ore')){
            return null
        }

        if(
            n.includes('redstone') ||
            n.includes('repeater') ||
            n.includes('comparator') ||
            n.includes('observer') ||
            n.includes('piston')
        ){
            return {
                tipo: 'redstone' as basefinderTipos,
                score: 5
            }
        }
        return null
    }
}