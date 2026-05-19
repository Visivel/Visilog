export class baseCache{
    private cache = new Set<string>()

    has(chave:string){
        return this.cache.has(chave)
    }

    add(chave: string){
        this.cache.add(chave)
    }

    clear(){
        this.cache.clear()
    }

    size(){
        return this.cache.size
    }
}