    import fs from 'fs'

    export interface blockItems{
        snowflake: string,
        x: number,
        y: number,
        z: number,
        name: string,
        id: number,
        inChunk: number
    }

    export class csvBlocks{
        private stream: fs.WriteStream

        // testar se funciona no windows dps
        constructor(private file = './src/bot/playeractivity/csvs/blocks.csv'){
            if(!fs.existsSync(this.file)){
                fs.writeFileSync(this.file, 'snowflake,x,y,z,name,block_id,count_in_chunk\n')
            }

            this.stream = fs.createWriteStream(this.file, { flags: 'a' })
        }

        save(data: blockItems){
            const items = [
                data.snowflake,
                data.x,
                data.y,
                data.z,
                this.escape(data.name),
                data.id,
                data.inChunk
            ].join(',')

            this.stream.write(items + '\n')
        }

        private escape(value: string) {
            return `"${value.replace('"', '""')}"`
        }
    }