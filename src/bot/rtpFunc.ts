import { dados } from "../config/yamlManager";
import { MCBot } from "./botManager";
import { loginManager } from "./loginManager";
import { scanChunk } from "./playeractivity/basefinder/utils/scanChunk";
import { csvBlocks } from "./playeractivity/csvBlocks";
import { csvLoot } from "./playeractivity/csvLoot";
import { csvTeleports } from "./playeractivity/csvTeleport";

// TODO: save de teleporte do bot, timestamp, coord
// TODO: separar isso em classes
// ex: Você foi teleportado para x26895 y105 z42727!

export class rtpFunc{
    private teleportado = false
    private ultimoRtp = 0

    constructor(
        private mc: MCBot,
        private login: loginManager,
        private lootCsv: csvLoot,
        private csvBlocksVar: csvBlocks,
        private csvTeleport: csvTeleports
    ){}

    init(){
        const bot = this.mc.getBot()
        
        const isSpawn = () => {
            if(Math.abs(bot.entity.position.x) <= 100 && Math.abs(bot.entity.position.z) <= 100) return true
            return false
        }

        const sendRtp = async () =>{
            if(!this.login.SMconnected) return
            const agora = Date.now()
            if(agora - this.ultimoRtp < 67420) return
            bot.chat("/rtp world world")
            console.log('bot deu rtp')
            this.ultimoRtp = agora
        }

        const scanBlocks = ()=>{
            setTimeout(() => {
                    const now = new Date()
                    const snowflake = `${now.getTime()}${Math.floor(Math.random() * 1000)}`
                    // sim, e preciso isso, sei que e feio.

                    const blocks = bot.findBlocks({
                        matching: (block)=>{
                            return dados.blockLogger.some(name => block.name.includes(name))
                        },
                        maxDistance: 256,
                        count: 100
                    })

                    for (const pos of blocks){
                        const block = bot.blockAt(pos)
                        if(!block) continue

                        this.csvBlocksVar.save({
                            snowflake,
                            x: pos.x,
                            y: pos.y,
                            z: pos.z,
                            name: block.name,
                            id: block.type,
                            inChunk: blocks.length
                        })
                    }

                        for(const entity of Object.values(bot.entities)){
                                if(entity.name !== 'item') continue

                                const meta = entity.metadata?.[8] as {
                                    id: number,
                                    count: number,
                                    nbt: unknown
                                }
                                if (!meta?.id) continue

                                this.lootCsv.save({
                                    snowflake,
                                    x: entity.position.x,
                                    y: entity.position.y,
                                    z: entity.position.z,
                                    stack: meta.count ?? 1,
                                    name: `item_${meta.id}`,
                                    id: meta.id,
                                    enchanted: !!meta.nbt
                                })
                            }
                    }, 12000);
        }

        bot.on('message', (msg)=>{
            if(msg.toString().includes('Você já está se teleportando')){
                this.teleportado = true
            }

            if(msg.toString().includes('Teleportando em')){
                this.teleportado = true
            }   

            const now = new Date()
            const snowflake = `${now.getTime()}${Math.floor(Math.random() * 1000)}`
            const match = msg.toString().match(/x(-?\d+)\s+y(-?\d+)\s+z(-?\d+)/)
            if(match){
                this.csvTeleport.save({
                    snowflake,
                    x: Number(match[1]),
                    y: Number(match[2]),
                    z: Number(match[3])
                })
            }
        })

        bot.on('spawn',()=>{
                if(!this.login.SMconnected) return
                sendRtp()

                if(!isSpawn()){
                    scanBlocks()
                }
        })

        setInterval(() => {
            sendRtp()

            if(!isSpawn()){
                scanBlocks()
            }
        }, 67420);
    }
}