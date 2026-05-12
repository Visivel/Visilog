import mineflayer from 'mineflayer'
import { botState } from '../metrics/metrics/botStatus'
import { msgCounter } from '../metrics/metrics/msgCounter'
import { dados } from '../config/yamlManager'
import minecraft from 'minecraft-protocol'


export class MCBot{
    private bot !: mineflayer.Bot
    private username: string    
    private host: string
    private port: number
    private version: string
    
    private mensagens: number = 0//ou bigint

    private botStat = new botState()
    private msgCounter = new msgCounter()

    constructor(username: string, host: string, port: number, version: string){
        this.username = username,
        this.host = host,
        this.port = port,
        this.version = version
    }

    start(){
        // SIM, ISSO E OBRIGATORIO KK
        // ele pede pra adicionar a lista de servers
        minecraft.ping({
            host: this.host,
            port: this.port
        })

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
