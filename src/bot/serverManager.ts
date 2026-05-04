import { dados } from "../config/yamlManager";
import { MCBot } from "./botManager";

export class serverManager{
    constructor(private mc: MCBot){

    }

    init() {
    const bot = this.mc.getBot()

    bot.once('spawn', () => {
        this.checkSlot(bot)
    //   setInterval(() => {
    //     console.log('held:', bot.heldItem)
    //     console.log('inv:', bot.inventory.items())
    //   }, 5000)
    })

    bot.on('forcedMove', () => {
        if(dados.teleportMsg == true){
            console.log('Bot teleportado')
        } else return
        // Solucao barata mas ok
        
        this.checkSlot(bot)
    })

    bot.on('windowOpen',()=>{
        bot.clickWindow(13,0,0)

    })

    
  }

  private checkSlot(bot: any) {
    const item = bot.inventory?.slots[36]

    if (!item) return

    const match = item.nbt?.value?.display?.value?.Name?.value.match(/"text":"([^"]+)"/)
    // tive que usar o robozinho, nunca que eu ia saber resolver isso
    // Agradecam o gepeteco por termos detector de lobby
    if (item.name === 'compass') {
        if (match) {
            bot.setQuickBarSlot(0)
            
            setTimeout(() => {
                bot.activateItem()
            }, 500);
        }
    }
  }
}