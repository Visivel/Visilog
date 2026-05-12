import { MCBot } from "./bot/botManager";
import { loginManager } from "./bot/loginManager";
import { csvBlocks } from "./bot/playeractivity/csvBlocks";
import { csvLoot } from "./bot/playeractivity/csvLoot";
import { rtpFunc } from "./bot/rtpFunc";
import { serverManager } from "./bot/serverManager";
import { dados } from "./config/yamlManager";
import { metricManager } from "./metrics/metricManager";
import { metricServer } from "./metrics/metricServer";
import { initMetrics } from "./metrics/registry";


initMetrics()

const bot = new MCBot(dados.bot.username, "bawmc.net", 25565, dados.bot.versao)
// Nome, Server, Versao

bot.start()

const loginresolver = new loginManager(bot)
loginresolver.init()

const metricMain = new metricServer()
metricMain.init(dados.grafanaConfig.expressPort)

const lootCsv = new csvLoot()
const blockCsv = new csvBlocks

const managers = [
    new serverManager(bot),
    new metricManager(bot),
    new rtpFunc(bot, loginresolver, lootCsv, blockCsv)
]

for (const manager of managers){
    manager.init()
}