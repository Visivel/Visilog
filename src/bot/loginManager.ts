import { MCBot } from "./botManager";
import { dados } from '../config/yamlManager'

export class loginManager{
    constructor(private mc: MCBot){}

    init(){
        const bot = this.mc.getBot()

        bot.once('spawn', ()=>{
            bot.chat(`/login ${dados.bot.senha}`)
            console.log("Login enviado")
        })

        bot.on('message', (message) =>{

            if(message.toString().includes("Utilize o comando /registrar")){
                bot.chat(`/registrar ${dados.bot.senha} ${dados.bot.senha}`)
                console.log("Registrado com sucesso")
            }

            // Handler
            if(message.toString().includes("Utilize o comando /logar")){
                setTimeout(() => {
                    bot.chat(`/login ${dados.bot.senha}`)
                    console.log("Login com sucesso")
                }, 2000);
            }
        })
    }
}