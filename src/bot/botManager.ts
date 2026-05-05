import mineflayer from 'mineflayer'
import { botState } from '../metrics/metrics/botStatus'
import { msgCounter } from '../metrics/metrics/msgCounter'
import { dados } from '../config/yamlManager'

export class MCBot{
    private bot !: mineflayer.Bot
    private username: string
    private host: string
    private version: string
    
    private mensagens: number = 0//ou bigint

    private botStat = new botState()
    private msgCounter = new msgCounter()

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

        // temporario ate novas metricas de rtp
        setInterval(() => {
            this.bot.chat("/spawn")
        }, 120000);
        
        this.bot.once('spawn', ()=>{
            this.botStat.set(1)
            console.log("Bot conectou-se com exito")
        })

        this.bot.on('message', (msg)=>{
            if(dados.config.printMsg){
                console.log(msg.toString())
            }
            this.mensagens+=1
            this.msgCounter.set(this.mensagens)
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
