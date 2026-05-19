import { dados } from "../../../../config/yamlManager";
import { basefinderTipos } from "../basefinderTypes";

export class blockDetector{
    getTipo(nome: string, y:number): basefinderTipos | null{
        const n = nome.toLowerCase()

        if (n.includes('sign')) return 'written_sign'
        if (n === 'nether_portal' || n === 'end_portal' || n === 'portal') return 'open_portal'
        if (n === 'bubble_column') return 'bubble_column'
        if (n === 'bedrock' && y > 4) return 'bedrock'
        if (n === 'spawner' && dados.basefinder.logSpawner|| n === 'mob_spawner' && dados.basefinder.logSpawner) return 'spawner'
        if (n === 'respawn_anchor' || n === 'glowstone') return 'pvp'

        if(
            n.includes('planks') ||
            n.includes('glass') ||
            n.includes('torch') ||
            n.includes('lantern') ||
            n.includes('bed')
        ){
            return 'sky_build'
        }
        return null
    }
    
    getScore(name: string, y:number){
        const n = name.toLowerCase()

        if (n.includes('sign')) return 3
        if (n === 'nether_portal' || n === 'end_portal' || n === 'portal') return 8
        if (n === 'bubble_column') return 10
        if (n === 'bedrock' && y > 4) return 15
        if (n === 'spawner' && dados.basefinder.logSpawner || n === 'mob_spawner' && dados.basefinder.logSpawner) return 12
        if (n === 'respawn_anchor' || n === 'end_gateway') return 12

        if(
            n.includes('planks') ||
            n.includes('glass') ||
            n.includes('torch') ||
            n.includes('lantern') ||
            n.includes('bed')
        ){
            return 2
        }
        return 0
    }
}