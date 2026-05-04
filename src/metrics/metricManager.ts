import { MCBot } from "../bot/botManager";
import { onlinePlayer } from "./onlinePlayers";

export class metricManager{
    private onlinePlayers = new onlinePlayer()
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
    }

    stop(){
        if (this.timer) clearInterval(this.timer)
    }


    private update(){
        const bot = this.mc.getBot()
        const count = Object.keys(bot.players ?? {}).length
        this.onlinePlayers.set(count)
    }
}