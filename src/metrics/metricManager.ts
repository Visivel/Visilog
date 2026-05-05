import { MCBot } from "../bot/botManager";
import { botPing } from "./metrics/botPing";
import { onlinePlayer } from "./metrics/onlinePlayers";
import { tpsLogger } from "./metrics/tpsLogger";

export class metricManager{
    private onlinePlayers = new onlinePlayer()
    private tpsGauge = new tpsLogger()
    private pingGauge = new botPing()
    private timer?: NodeJS.Timeout

    constructor(private mc: MCBot){}

    start(){
        const bot = this.mc.getBot()

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
}