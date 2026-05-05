import client from 'prom-client'
import { register } from '../registry'

export class botPing{
    private gauge = new client.Gauge({
        name:"mc_botping",
        help:"Mostra o ping do bot",
        registers:[register]
    })

    set(value: number){
        this.gauge.set(value)
    }
}