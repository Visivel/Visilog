import express from "express";
import { register } from "./registry";

export class metricServer{
    private app = express()
    private started = false

    start(port: number){
        if (this.started) return
        this.started = true

        this.app.get('/metrics', async (_req, res)=>{
            const metrics = await register.metrics()

            res.set('Content-Type', register.contentType)
            res.end(metrics)
        })

        this.app.listen(port, ()=>{
            console.log(`metrics na porta http://localhost:${port}/metrics`)
        })
    }
}