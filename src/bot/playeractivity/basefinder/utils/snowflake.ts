export function snowflake(){
    return `${Date.now()}${Math.floor(Math.random()*1000)}`
}