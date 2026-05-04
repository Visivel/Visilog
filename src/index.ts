import { MCBot } from "./bot/botManager";
import { loginManager } from "./bot/loginManager";
import { serverManager } from "./bot/serverManager";
import { dados } from "./config/yamlManager";


const bot = new MCBot(`${dados.username}`, "bawmc.net", '1.20.1')
// Nome, Server, Versao

bot.start()

const loginresolver = new loginManager(bot)
loginresolver.init()

const serverdetect = new serverManager(bot)
serverdetect.init()



