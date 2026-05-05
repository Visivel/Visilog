import mineflayer from 'mineflayer'
import { botState } from '../metrics/metrics/botStatus'

export class MCBot{
    private bot !: mineflayer.Bot
    private username: string
    private host: string
    private version: string
    private botStat = new botState()

    constructor(username: string, host: string, version: string){
        this.username = username,
        this.host = host,
        this.version = version
    }

    start(){
        this.bot = mineflayer.createBot({
            username: this.username,
            host: this.host,
            version: this.version
        })
        
        this.bot.once('spawn', ()=>{
            this.botStat.set(1)
            console.log("Bot conectou-se com exito")
        })

        this.bot.on('message', (msg)=>{
            console.log(msg.toString())
        })

        this.bot.on('kicked', (err)=>{
            this.botStat.set(0)
            console.log("[!] ERRO", err)
        })

        this.bot.on('end', ()=>{
            this.botStat.set(0)
            console.log("Bot disconectado")
        })
    }

    getBot(){
        return this.bot
    }
}
