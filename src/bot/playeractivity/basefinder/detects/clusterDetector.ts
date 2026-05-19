export interface clusterDetectorOpt{
    limite?: number
}

export class clusterDetector{
    constructor(private readonly opcoes: clusterDetectorOpt = {}) {}

    private get limite(){
        return this.opcoes.limite ?? 14
    }

    isCluster(count: number){
        return count >= this.limite
    }

    getScore(count: number){
        if(count >= 30) return 25
        if(count >= 20) return 18
        if(count >= this.limite) return 14

        return 0
    }
}