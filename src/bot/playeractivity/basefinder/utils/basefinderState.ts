export class basefinderState{
    private baseAchada = false
    private baseTicks = 0
    private entityScanTicks = 0
    private basespamTicks = 0

    // nome de variaveis feias, eu sei
    constructor(
        private readonly entityscanDelay = 20, 
        private readonly baseAchadaMsgDelay = 5
    ){}

    tick(){
        if(this.baseAchada && this.baseTicks < this.baseAchadaMsgDelay){
            this.baseTicks++
        } else if(this.baseTicks >= this.baseAchadaMsgDelay){
            this.baseAchada = false
            this.baseTicks = 0
        }

        if(this.entityScanTicks < this.entityscanDelay){
            this.entityScanTicks++
            return false
        }

        this.entityScanTicks = 0
        return true
    }

    markAchado(){
        this.baseAchada = true
        this.basespamTicks = 0
    }

    podeAnunciar(){
        return this.basespamTicks === 0
    }

    spamTick(){
        if(this.basespamTicks < this.baseAchadaMsgDelay){
            this.basespamTicks++
        }
    }

    reset(){
        this.baseAchada = false
        this.baseTicks = 0
        this.entityScanTicks = 0
        this.basespamTicks = 0
    }

    getState(){
        return {
            baseAchada: this.baseAchada,
            baseTicks: this.baseTicks,
            entityScanTicks: this.entityScanTicks,
            basespamTicks: this.basespamTicks
        }
    }
}