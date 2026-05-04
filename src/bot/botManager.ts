import mineflayer from 'mineflayer'

export class MCBot{
    private bot !: mineflayer.Bot
    private username: string
    private host: string
    private version: string

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
            console.log("Bot conectou-se com exito")
        })

        this.bot.on('message', (msg)=>{
            console.log(msg.toString())
        })

        this.bot.on('kicked', (err)=>{
            console.log(err)
        })
    }

    getBot(){
        return this.bot
    }
}
