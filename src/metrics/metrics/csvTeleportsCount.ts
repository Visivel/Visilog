import client from 'prom-client'
import { register } from '../registry'

export class csvTeleportsCount{
    private gauge = new client.Gauge({
        name:"mc_teleportscount",
        help:"contador de quantas vezes o bot teleportou",
        registers: [register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}