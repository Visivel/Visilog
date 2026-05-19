    import { MCBot } from "../bot/botManager";
    import { botPing } from "./metrics/botPing";
import { csvBases } from "./metrics/csvBases";
import { csvBlocos } from "./metrics/csvBlocos";
import { csvLoots } from "./metrics/csvLoots";
import { csvTeleportsCount } from "./metrics/csvTeleportsCount";
    import { onlinePlayer } from "./metrics/onlinePlayers";
    import { tpsLogger } from "./metrics/tpsLogger";
    import fs from 'fs'


    // ARRUMAR URGENTE ESSE CODIGO DEPOIS KKKKKKKK

    export class metricManager{
        private onlinePlayers = new onlinePlayer()
        private tpsGauge = new tpsLogger()
        private pingGauge = new botPing()
        private blockGauge = new csvBlocos()
        private lootGauge = new csvLoots()
        private baseGauge = new csvBases()
        private teleportGauge = new csvTeleportsCount()

        private blockCount = 0
        private lootCount = 0
        private baseCount = 0
        private teleportCount = 0
        private timer?: NodeJS.Timeout

        constructor(private mc: MCBot){}
        
        init(){
            this.blockCount = this.countCsv('./src/bot/playeractivity/csvs/blocks.csv')
            this.lootCount = this.countCsv('./src/bot/playeractivity/csvs/loots.csv')
            this.baseCount = this.countCsv('./src/bot/playeractivity/csvs/bases.csv')
            this.teleportCount = this.countCsv('./src/bot/playeractivity/csvs/teleports.csv')
            const bot = this.mc.getBot()

            setInterval(() => {
                const newBlock = this.countCsv('./src/bot/playeractivity/csvs/blocks.csv')
                const newLoot = this.countCsv('./src/bot/playeractivity/csvs/loots.csv')
                const newBase = this.countCsv('./src/bot/playeractivity/csvs/bases.csv')
                const newTeleport = this.countCsv('./src/bot/playeractivity/csvs/teleports.csv')

                if(newBlock > this.blockCount){
                    this.blockCount = newBlock
                    this.blockGauge.set(newBlock)
                }
                if(newLoot > this.lootCount){
                    this.lootCount = newLoot
                    this.lootGauge.set(newLoot)
                }
                if(newBase > this.baseCount){
                    this.baseCount = newBase
                    this.baseGauge.set(newBase)
                }
                if(newTeleport > this.teleportCount){
                    this.teleportCount = newTeleport
                    this.teleportGauge.set(newTeleport)
                }
                
            }, 5000);

            bot.on('playerJoined',()=>{
                this.update()

                this.timer = setInterval(() => {
                    this.update
                }, 2000);
            })
            
            bot.on('playerLeft',()=>{
                this.update()

                this.timer = setInterval(() => {
                    this.update
                }, 2000);
            })
            
            setInterval(() => {
                this.pingGauge.set(bot.players[bot.username]?.ping ?? 0)
            }, 5000);
            
            // Creditos: https://github.com/PrismarineJS/mineflayer/issues/822
            // Tava um porre pra arrumar esse TPS
            let calcTps: number[] = []

            function runTps() {
            const time = bot.time.age

            setTimeout(() => {
                const diff = bot.time.age - time

                calcTps.push(diff)

                if (calcTps.length > 20) {
                calcTps.shift()
                }

                runTps()
            }, 1000)
            }

            function getTps() {
            if (calcTps.length === 0) return 20

            const avg = calcTps.reduce((a, b) => a + b, 0) / calcTps.length

            return Math.min(20, avg)
            }

            bot.once('spawn',()=>{
                runTps()
            })
            setInterval(() => {
                this.tpsGauge.set(getTps())
            }, 2000)
        }

        // ----------------------------

        stop(){
            if (this.timer) clearInterval(this.timer)
        }


        private update(){
            const bot = this.mc.getBot()
            const count = Object.keys(bot.players ?? {}).length
            this.onlinePlayers.set(count)
        }

        private countCsv(path: string){
            if(!fs.existsSync(path)) return 0

            return fs.readFileSync(path, 'utf8').split('\n').filter(Boolean).length
        }
    }