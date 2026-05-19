import { basefinderTipos } from "../basefinderTypes";

export interface skybuildDetectorOpt{
    yLimite?: number,
    ignoreBlocos?: Set<string>
}

export class skybuildDetector{
    constructor(private readonly opt: skybuildDetectorOpt = {}){}

    private get yLimite(){
        return this.opt.yLimite ?? 180
    }

    private readonly defaultIgnorar = new Set([
        'air',
        'stone',
        'deepslate',
        'dirt',
        'grass_block',
        'water',
        'sand',
        'gravel',
        'bedrock',
        'netherrack',
        'lava'
    ])

    detect(nome: string, y:number){

        if(y<this.yLimite) return null // pode ser maior se quiser, tipo 200+
        if(this.defaultIgnorar.has(nome.toLowerCase())) return null

        return {
            tipo: 'sky_build' as basefinderTipos,
            score: 4
         }
    }
}