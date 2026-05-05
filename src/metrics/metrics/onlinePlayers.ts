import client from 'prom-client'
import { register } from '../registry'

export class onlinePlayer{
    private gauge = new client.Gauge({
        name:"mc_onlineplayers",
        help:"jogadores online",
        registers: [register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}