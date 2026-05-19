import fs from 'fs'
import path from 'path'
import { basefinderValues } from './basefinder/basefinderTypes'

export class csvBasefinder{
    private stream: fs.WriteStream

    constructor(private file = './src/bot/playeractivity/csvs/bases.csv'){
        if(!fs.existsSync(this.file)){
            fs.writeFileSync(this.file, 'snowflake,tipos,chunkX,chunkZ,x,y,z,name,id,score\n')
        }

        this.stream = fs.createWriteStream(this.file, {flags: 'a'})
    }

    save(dados: basefinderValues){
        this.stream.write([
            dados.snowflake,
            dados.tipos,
            dados.chunkX,
            dados.chunkZ,
            dados.x,
            dados.y,
            dados.z,
            this.escape(dados.name),
            dados.id,
            dados.score
        ].join(',')+'\n')
    }

    private escape(value: string) {
        return `"${value.replace('"', '""')}"`
  }
}