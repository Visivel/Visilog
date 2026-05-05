import client from 'prom-client'
import { register } from '../registry'

export class msgCounter{
    private gauge = new client.Gauge({
        name:"mc_msgCount",
        help:"Conta quantas mensagens foram enviadas desde o bot online",
        registers:[register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}