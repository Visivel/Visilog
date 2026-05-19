import client from 'prom-client'
import { register } from '../registry'

export class csvBases{
    private gauge = new client.Gauge({
        name:"mc_basescount",
        help:"conta quantas bases o basefinder v2 achou",
        registers: [register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}