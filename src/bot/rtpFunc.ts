import { dados } from "../config/yamlManager";
import { MCBot } from "./botManager";
import { loginManager } from "./loginManager";
import { csvBlocks } from "./playeractivity/csvBlocks";
import { csvLoot } from "./playeractivity/csvLoot";

// TODO: save de teleporte do bot, timestamp, coord
// ex: Você foi teleportado para x26895 y105 z42727!

export class rtpFunc{
    constructor(
        private mc: MCBot,
        private login: loginManager,
        private lootCsv: csvLoot,
        private lootBlocks: csvBlocks
    ){}

    init(){
        const bot = this.mc.getBot()
   
        bot.on('spawn',()=>{
            setInterval(() => { //mudar isso aqui, ta dando rtp varias vezes a longo prazo
                if(!this.login.SMconnected) return

                bot.chat("/rtp world world")
                console.log('bot deu rtp')

                setTimeout(() => {
                    const now = new Date()
                    const snowflake = `${now.getTime()}${Math.floor(Math.random() * 1000)}`
                    // sim, e preciso isso, sei que e feio.
    
                    const blocks = bot.findBlocks({
                        matching: (block)=>{ // colocar na config.yml dps
                            return dados.blockLogger.some(name => block.name.includes(name))
                        },
                        maxDistance: 256,
                        count: 100
                    })

                    for (const pos of blocks){
                        const block = bot.blockAt(pos)
                        if(!block) continue
                        this.lootBlocks.save({
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
                    }, 5000);              
            }, 67420);  
        })
    }
}