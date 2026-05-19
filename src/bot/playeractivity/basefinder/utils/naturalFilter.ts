export class naturalFilter{
    private readonly pularBlocos = new Set([
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

    private readonly spawnerBlocos = new Set([
        'mossy_cobblestone',
        'cobweb',
        'stone_brick_stairs',
        'budding_amethyst'
    ])

    podeSkip(nome: string){
        return this.pularBlocos.has(nome.toLowerCase()) || nome.toLowerCase().endsWith('_air')
    }

    eSpawnerNarutal(nome: string){
        return this.spawnerBlocos.has(nome.toLowerCase())
    }
}