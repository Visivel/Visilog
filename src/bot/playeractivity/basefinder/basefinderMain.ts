import { MCBot } from "../../botManager"
import { csvBasefinder } from "../csvBasefinder"
import { basefinderTipos, basefinderValues } from "./basefinderTypes"
import { blockDetector } from "./detects/blockDetector"
import { entityDetector } from "./detects/entityDetector"
import { illegalDetector } from "./detects/illegalDetector"
import { portalDetector } from "./detects/portalDetector"
import { redstoneDetector } from "./detects/redstoneDetector"
import { signDetector } from "./detects/signDetector"
import { skybuildDetector } from "./detects/skybuildDetector"
import { storageDetector } from "./detects/storageDetector"
import { clusterDetector } from "./detects/clusterDetector"
import { chunkScore } from "./utils/chunkScore"
import { baseCache } from "./utils/baseCache"
import { chunkChave } from "./utils/chunkChave"
import { toChunk } from "./utils/chunkMath"
import { scanChunk } from "./utils/scanChunk"
import { naturalFilter } from "./utils/naturalFilter"
import { snowflake } from "./utils/snowflake"


export class basefinderMain {
    private blockDet = new blockDetector()
    private entityDet = new entityDetector()
    private illegalDet = new illegalDetector()
    private portalDet = new portalDetector()
    private redstoneDet = new redstoneDetector()
    private placaDet = new signDetector()
    private skybuildDet = new skybuildDetector()
    private storageDet = new storageDetector()
    private clusterDet = new clusterDetector()
    private scores = new chunkScore()
    private cache = new baseCache()
    private filtro = new naturalFilter()

    constructor(
        private mc: MCBot,
        private csv: csvBasefinder
    ){}

    init(){
        const bot = this.mc.getBot()

        bot.on('spawn', () =>{
            setInterval(() => this.scanAmbiente(bot), 10000)
        })
    }

    private isSpawn(x: number, z: number){
        return Math.abs(x) <= 100 && Math.abs(z) <= 100
        // 100 => limite do spawn, abaixo de 100 ate -100 nao da log
    }

    private async scanAmbiente(bot: any){
        if(!bot.entity.position) return
        if(this.isSpawn(bot.entity.position.x, bot.entity.position.z)) return

        try{
            await bot.waitForChunksToLoad() 
        } catch{}

        const centroX = toChunk(bot.entity.position.x)
        const centroZ = toChunk(bot.entity.position.z)
        const raio = 3

        for(let dx = -raio; dx <= raio; dx++){
            for(let dz = -raio; dz <= raio; dz++){
                const cx = centroX + dx
                const cz = centroZ + dz
                const chave = chunkChave(cx, cz)
                if (this.cache.has(chave)) continue
                await this.scanChunk(bot, cx, cz)
                this.cache.add(chave)
            }
        }

        this.scanEntities(bot, centroX, centroZ, raio)
    }

    private async scanChunk(bot: any, chunkX: number, chunkZ: number){
        const chave = chunkChave(chunkX, chunkZ)
        const detections: basefinderValues[] = []
        let portalLogged = false

        await scanChunk(bot, chunkX, chunkZ, (bloco, x, y, z) =>{
            if(this.filtro.podeSkip(bloco.name)) return
            if(this.isSpawn(x, z)) return

            const result = this.detectBlock(bloco, x, y, z)
            if(!result) return
            if(result.tipos === 'bubble_column') return
            if(result.tipos === 'open_portal') {
                if (portalLogged) return
                portalLogged = true
            }

            this.scores.add(chave, result.score)
            detections.push(result)
        }, 0, 260)

        if(this.scores.get(chave) >= 20) { // 20 => score max
            for(const d of detections) {
                this.csv.save(d)
            }
        }
    }

    private detectBlock(bloco: any,x: number, y: number, z: number): basefinderValues | null{
        const nome = bloco.name.toLowerCase()
        const sf = snowflake()
        const chunkX = toChunk(x)
        const chunkZ = toChunk(z)

        const resultPlaca = nome.includes('sign') ? this.placaDet.detect(bloco) : null
        if(resultPlaca){
            return {
                snowflake: sf,
                tipos: resultPlaca.tipo,
                chunkX, chunkZ,
                x, y, z,
                name: bloco.name,
                id: bloco.type ?? 0,
                score: resultPlaca.score
            }
        }

        const candidates: Array<{ tipo: basefinderTipos; score: number } | null> =[
            this.portalDet.detect(nome),
            this.illegalDet.detect(nome, y),
            this.redstoneDet.detect(nome),
            this.storageDet.detect(nome),
        ]

        const sky = this.skybuildDet.detect(nome, y)
        if(sky) candidates.push(sky)

        const bdTipo = this.blockDet.getTipo(nome, y)
        if(bdTipo){
            if(!(bdTipo === 'sky_build' && this.skybuildDet.detect(nome, y) === null)){
                candidates.push({ tipo: bdTipo, score: this.blockDet.getScore(nome, y) })
            }
        }

        let best: { tipo: basefinderTipos; score: number } | null = null
        for(const r of candidates){
            if(r && (!best || r.score > best.score)){
                best = r
            }
        }

        if(!best) return null

        return{
            snowflake: sf,
            tipos: best.tipo,
            chunkX, chunkZ,
            x, y, z,
            name: bloco.name,
            id: bloco.type ?? 0,
            score: best.score
        }
    }

    private scanEntities(bot: any, centerX: number, centerZ: number, radius: number){
        const entities: any[] = Object.values(bot.entities ?? {})
        const porChunk = new Map<string, basefinderValues[]>()
        const clusterCount = new Map<string, number>()

        for(const entity of entities) {
            const ex = toChunk(entity.position?.x ?? 0)
            const ez = toChunk(entity.position?.z ?? 0)
            if(Math.abs(ex - centerX) > radius || Math.abs(ez - centerZ) > radius) continue
            if(this.isSpawn(entity.position?.x ?? 0, entity.position?.z ?? 0)) continue

            const result = this.entityDet.detect(entity.name ?? '')
            if(result){
                const chave = chunkChave(ex, ez)
                this.scores.add(chave, result.score)

                const val: basefinderValues ={
                    snowflake: snowflake(),
                    tipos: result.tipo,
                    chunkX: ex,
                    chunkZ: ez,
                    x: Math.floor(entity.position?.x ?? 0),
                    y: Math.floor(entity.position?.y ?? 0),
                    z: Math.floor(entity.position?.z ?? 0),
                    name: entity.name ?? 'unknown',
                    id: entity.type ?? entity.id ?? 0,
                    score: result.score
                }

                const existind = porChunk.get(chave) ?? []
                existind.push(val)
                porChunk.set(chave, existind)
            }

            const chave = chunkChave(ex, ez)
            clusterCount.set(chave, (clusterCount.get(chave) ?? 0) + 1)
        }

        for(const [chave, count] of clusterCount){
            if (this.clusterDet.isCluster(count)){
                this.scores.add(chave, this.clusterDet.getScore(count))
            }
        }

        for(const [chave, detections] of porChunk){
            if (this.scores.get(chave) >= 20) { // 20 => score max
                for (const d of detections) {
                    this.csv.save(d)
                }
            }
        }
    }
}
