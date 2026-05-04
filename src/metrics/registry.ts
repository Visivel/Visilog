import client from 'prom-client'

export const register = client.register

let iniciado = false

export function initMetrics(){
    if(iniciado) return

    client.collectDefaultMetrics({register})
    iniciado = true
}