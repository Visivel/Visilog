export type lerBlocos = {
    nome: string,
    getTextoPlaca?: ()=> unknown
}

// TODO: testar depois se ta funcionando

export class blockEntity{
    lerLinhas(bloco: lerBlocos){
        const raw = bloco.getTextoPlaca?.()
        if(!raw) return null

        if(Array.isArray(raw)){
            const linhas = raw.flat()
                .map(linha => String(linha ?? '').trim())

            return linhas
        }
        return null
    }

    temTexto(bloco: lerBlocos){
        const linhas = this.lerLinhas(bloco)
        if(!linhas) return false

        return linhas.some(linha =>
            linha.length > 0 &&
            linha !== '<----' &&
            linha !== '---->'
        )
    }
}