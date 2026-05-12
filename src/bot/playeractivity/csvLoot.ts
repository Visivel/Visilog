import fs from 'fs'

export interface lootItems{
    snowflake: string,
    x: number,
    y: number,
    z: number,
    stack: number,
    name: string,
    id: number,
    enchanted: boolean
}

export class csvLoot{
    private stream: fs.WriteStream

    constructor(private file = './src/bot/playeractivity/csvs/loots.csv'){
        if(!fs.existsSync(this.file)){
            fs.writeFileSync(this.file, 'snowflake,x,y,z,stack,name,item_id,enchanted\n')
        }

        this.stream = fs.createWriteStream(this.file, {flags: 'a'})
    }

    save(data: lootItems){
        const itens = [
            data.snowflake,
            data.x,
            data.y,
            data.z,
            data.stack,
            this.escape(data.name),
            data.id,
            data.enchanted
        ].join(',')

        this.stream.write(itens + '\n')
    }

    private escape(value: string) {
        return `"${value.replace('"', '""')}"`
    }
}