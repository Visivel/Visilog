import client from 'prom-client'
import { register } from '../registry'

export class csvLoots{
    private gauge = new client.Gauge({
        name:"mc_lootcount",
        help:"conta quantos loot dropado o bot ja encontrou no total",
        registers: [register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}