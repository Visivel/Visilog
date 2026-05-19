import { basefinderTipos } from "../basefinderTypes";

export class entityDetector{
    detect(nome: string): {
        tipo: basefinderTipos,
        score: number
    } | null{
        const n = nome.toLowerCase()

        if(n === 'item_frame' || n=== 'glow_item_frame'){
            return{
                tipo: 'item_frame',
                score: 4
            }
        }
        if(n.includes('pearl')){
            return {
                tipo: 'ender_pearl',
                score: 5
            }
        }

        if(n.includes('villager')){
            return {
                tipo: 'villager',
                score: 6
            }
        }

        if(n.includes('boat')){
            return {
                tipo: 'boat',
                score: 3
            }
        }
        return null
    }
}