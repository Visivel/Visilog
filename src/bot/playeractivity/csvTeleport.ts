import fs from 'fs'

export interface teleport{
    snowflake: string,
    x: number,
    y: number,
    z: number
}

export class csvTeleports{
    private stream: fs.WriteStream
    constructor(private file = './src/bot/playeractivity/csvs/teleports.csv'){
        if(!fs.existsSync(this.file)){
            fs.writeFileSync(this.file, 'snowflake,x,y,z')
        }
        
        this.stream = fs.createWriteStream(this.file, {flags: 'a'})
    }

    save(data: teleport){
        const values = [
            data.snowflake,
            data.x,
            data.y,
            data.z
        ].join(',')

        this.stream.write(values + '\n')
    }

    private escape(value: string) {
        return `"${value.replace('"', '""')}"`
    }
}