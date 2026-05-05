import client from 'prom-client'
import { register } from '../registry'

export class tpsLogger{
    private gauge = new client.Gauge({
        name:"mc_tps",
        help:"monitora o TPS do servidor",
        registers: [register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}