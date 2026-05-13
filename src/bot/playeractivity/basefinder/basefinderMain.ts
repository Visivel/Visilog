import { Vec3 } from "vec3";
import { MCBot } from "../../botManager";
import { dados } from "../../../config/yamlManager";
import { csvBasefinder } from "../csvBasefinder";
import { basefinderTipos, basefinderValues, basefinderLog } from "./basefinderTypes";

// Creditos:
// https://github.com/etianl/Trouser-Streak/blob/main/src/main/java/pwn/noobs/trouserstreak/modules/BaseFinder.java

type tipoEntidade = {
    name?: string,
    displayName?: string,
    position?: {x:number, y:number, z:number},
    metadata?: unknown[],
    villagerData?: { level?: number},
    customName?: string
}

type itemMeta = {
    itemId?: number,
    itemCount?: number,
    nbtData?: unknown
}

export class basefinderMain{
    private started = false
    private baseAchada = false
    private baseTicks = 0
    private entityScanTicks = 0

    private scannedChunks = new Set<string>()
    private baseChunks = new Set<string>()
    private logBasePos = new Set<string>()
    private loggedBases: basefinderLog[] = []

    constructor(private mc: MCBot, private csv: csvBasefinder){}

    init(){
        const bot = this.mc.getBot()

        if(this.started) return
        this.started = true

        bot.on('chunkColumnLoad', (ponto)=>{
            const chunkX = Math.floor(ponto.x / 16)
            const chunkZ = Math.floor(ponto.y / 16)
            void this.scanChunk(chunkX, chunkZ)
        })

        bot.on('entitySpawn', (entity)=>{
            this.scanUmEntity(entity as tipoEntidade)
        })

        bot.on('physicsTick', ()=>{
            this.tick()
        })
    }

    private tick(){
        if (this.baseAchada && this.baseTicks < 5){
            this.baseTicks++
        } else if (this.baseTicks >= 5){
            this.baseAchada = false
            this.baseTicks = 0
        }

        if(this.entityScanTicks < 20){
            this.entityScanTicks++
            return
        }

        this.entityScanTicks = 0
        this.scanEntities()
    }

    private async scanChunk(chunkX: number, chunkZ: number){
        const bot = this.mc.getBot()
        await bot.waitForChunksToLoad()

        const chave = `${chunkX}:${chunkZ}`
        if(this.scannedChunks.has(chave)) return
        this.scannedChunks.add(chave)

        const minY = -64
        const maxY = 319

        for(let dx=0; dx < 16; dx++){
            for(let dz = 0; dz <16; dz++){
                for(let y = minY; y <= maxY; y++){
                    const x = chunkX*16+dx
                    const z = chunkZ*16+dz

                    const block = bot.blockAt(new Vec3(x, y, z), true)
                    if(!block) continue

                    const tipo = this.getBlockTipo(block.name, y)
                    if(!tipo) continue

                    const score = this.getBlockScore(block.name, y)
                    if(score <= 0) continue

                     this.markBase({
                             tipos: tipo, // eu sei kkkkk
                             chunkX,
                             chunkZ,
                             x,
                             y,
                             z,
                             name: block.name,
                             id: block.type,
                             score
                         }) 
                }

                
            }
        }
    }

    private scanEntities(){
        const bot = this.mc.getBot()
        const render = 32

        for(const entity of Object.values(bot.entities) as tipoEntidade[]){
            this.scanUmEntity(entity)
         }

        const playerChunkX = Math.floor(bot.entity.position.x/16)
        const playerChunkZ = Math.floor(bot.entity.position.x/16)
        
        let entityCount = 0
         for(const entity of Object.values(bot.entities) as tipoEntidade[]){
             if(!entity.position) continue

             const chunkX = Math.floor(bot.entity.position.x/16)
             const chunkZ = Math.floor(bot.entity.position.x/16)

             if(Math.abs(chunkX - playerChunkX) <= render && Math.abs(chunkZ - playerChunkZ) <= render){
                 entityCount++
             }
            
         }

        if(entityCount >=14){
            const chunkChave = `${playerChunkX}:${playerChunkZ}`
            if(!this.baseChunks.has(chunkChave)){
                this.baseChunks.add(chunkChave)
                this.markBase({
                    tipos: 'entity_cluster',
                    chunkX: playerChunkX,
                    chunkZ: playerChunkZ,
                    x: bot.entity.position.x,
                    y: bot.entity.position.y,
                    z: bot.entity.position.z,
                    name: 'entity_cluster',
                    id: 0,
                    score: 14
                })
            }
        }
    }

    private scanUmEntity(entity: tipoEntidade){
        if(!entity.position) return

        const x = Math.floor(entity.position.x)
        const y = Math.floor(entity.position.y)
        const z = Math.floor(entity.position.z)
        const chunkX = Math.floor(x / 16)
        const chunkZ = Math.floor(z / 16)

        const name = (entity.name ?? '').toLowerCase()
        const display = (entity.displayName ?? '').toLowerCase()
        const custom = (entity.customName ?? '').toLowerCase()

        if(name === 'item_frame' || name == 'glow_item_frame'){
            this.markBase({
                tipos: 'item_frame',
                chunkX,
                chunkZ,
                x,
                y,
                z,
                name: entity.name ?? 'item_frame',
                id: 0,
                score: 4
            })
            return
        }

        if(name.includes('pearl')){
            this.markBase({
                tipos: 'ender_pearl',
                chunkX,
                chunkZ,
                x,y,z,
                name: entity.name ?? 'ender_pearl',
                id: 0,
                score: 5
            })
        }
        return

        if(name.includes('villager')){
            const level = entity.villagerData?.level ?? 1
            if(level > 1){
                this.markBase({
                    tipos: 'villager',
                    chunkX,
                    chunkZ,
                    x,y,z,
                    name: entity.name ?? 'villager',
                    id: 0,
                    score: 6
                })
            }
            return
        }

        if(name.includes('boat')){
            this.markBase({
                tipos: 'boat',
                chunkX, chunkZ,
                x,y,z,
                name: entity.name ?? 'boat',
                id: 0,
                score: 3
            })
        }
        return

        if(custom || display){
            this.markBase({
                tipos: 'nametag',
                chunkX, chunkZ,
                x,y,z,
                name: entity.name ?? 'nametagged',
                id: 0,
                score: 3
            })
        }
    }

    private getBlockTipo(name: string, y: number): basefinderTipos | null{
        const n = name.toLocaleLowerCase()

        if (n.includes('sign')) return 'written_sign'
        if (n === 'nether_portal' || n === 'end_portal' || n === 'portal') return 'open_portal'
        if (n === 'bubble_column') return 'bubble_column'
        if (n === 'bedrock' && y > 4) return 'bedrock'
        if (n === 'spawner' || n === 'mob_spawner') return 'spawner'
        if (n === 'respawn_anchor' || n === 'end_gateway') return 'nether_roof'
        if (n.includes('planks') || n.includes('glass') || n.includes('torch') || n.includes('lantern') || n.includes('bed')) return 'sky_build'
        return null
    }

    private getBlockScore(name: string, y: number){
        const n = name.toLowerCase()

        if (n.includes('sign')) return 3
        if (n === 'nether_portal' || n === 'end_portal' || n === 'portal') return 8
        if (n === 'bubble_column') return 10
        if (n === 'bedrock' && y > 4) return 15
        if (n === 'spawner' || n === 'mob_spawner') return 20
        if (n === 'respawn_anchor' || n === 'end_gateway') return 12
        if (n.includes('planks') || n.includes('glass') || n.includes('torch') || n.includes('lantern') || n.includes('bed')) return 2
        return 0
    }

    private markBase(tipo: Omit<basefinderValues, 'snowflake'>){
        const chunkChave = `${tipo.chunkX}:${tipo.chunkZ}`
        const posChave = `${tipo.x}:${tipo.y}:${tipo.z}:${tipo.tipos}`

        this.baseChunks.add(chunkChave)
        this.logBasePos.add(posChave)

        const now = new Date()
        const snowflake = `${now.getTime()}${Math.floor(Math.random() * 1000)}`

        const fullTipo: basefinderValues = {
            snowflake,
            ...tipo
        }

        if (!this.loggedBases.some(b => b.x === tipo.x && b.y === tipo.y && b.z === tipo.z && b.tipo === tipo.tipos)) {
            this.loggedBases.push({
                chunkX: tipo.chunkX,
                chunkZ: tipo.chunkZ,
                tipo: tipo.tipos,
                x: tipo.x,
                y: tipo.y,
                z: tipo.z,
                score: tipo.score,
                name: tipo.name
            })
            this.csv.save(fullTipo)
        }

        if(this.baseTicks === 0){
            this.baseAchada = true
        }
    }
}