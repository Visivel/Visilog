export class chunkScore{
    private scores = new Map<string, number>()

    add(chave: string, score: number){
        const atual = this.scores.get(chave) ?? 0
        this.scores.set(chave, atual+score)
    }

    get(chave: string){
        return this.scores.get(chave) ?? 0
    }

    has(chave: string){
        return this.scores.has(chave)
    }

    isSus(chave: string, limite=20){
        return this.get(chave) >= limite
    }

    // socorro
    top(limite = 10){
        return [...this.scores.entries()]
            .sort((a,b)=>b[1]-a[1])
            .slice(0, limite)
    }

    clear(){
        this.scores.clear()
    }
}