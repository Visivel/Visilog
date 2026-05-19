import client from 'prom-client'
import { register } from '../registry'

export class csvBlocos{
    private gauge = new client.Gauge({
        name:"mc_blockcount",
        help:"conta quantos blocos o basefinder v1 achou",
        registers: [register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}