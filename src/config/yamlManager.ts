import fs from 'fs'
import { parse } from 'yaml'

interface Config{
    username: string,
    senha: string,
    teleportMsg: boolean
}

const arquivo = fs.readFileSync('./config.yaml', 'utf-8')
const lidos = parse(arquivo)

export const dados: Config = lidos.bot