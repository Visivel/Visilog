import client from 'prom-client'
import { register } from '../registry'

export class botState{
    private gauge = new client.Gauge({
        name:"mc_status",
        help:"Mostra se o bot esta online ou offline (0=off,1=on)",
        registers: [register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}