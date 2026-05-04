import { MCBot } from "./bot/botManager";
import { loginManager } from "./bot/loginManager";
import { serverManager } from "./bot/serverManager";
import { dados } from "./config/yamlManager";
import { metricManager } from "./metrics/metricManager";
import { metricServer } from "./metrics/metricServer";
import { initMetrics } from "./metrics/registry";

initMetrics()

const bot = new MCBot(`${dados.bot.username}`, "bawmc.net", '1.20.1')
// Nome, Server, Versao

bot.start()

const loginresolver = new loginManager(bot)
const serverdetect = new serverManager(bot)
const metricMain = new metricServer()
const metricManage = new metricManager(bot)

    loginresolver.init()
    serverdetect.init()
    metricMain.start(dados.grafanaConfig.expressPort)
    metricManage.start()


