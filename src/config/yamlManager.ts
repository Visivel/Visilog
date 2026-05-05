import fs from 'fs'
import { parse } from 'yaml'

interface Config{
    bot:{
        username: string
        senha: string
    }

    config:{
        teleportMsg: boolean
        printMsg: boolean
    }
    
    grafanaConfig:{
        expressPort: number
    }
}

const arquivo = fs.readFileSync('./config.yaml', 'utf-8')
const lidos = parse(arquivo) as Config

export const dados = lidos