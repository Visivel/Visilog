export async function scanEntities(
    bot: any,
    callback: (entity: any) => void | Promise<void>
) {
    if(!bot?.entities) return

    for(const entity of Object.values(bot.entities)) {
        await callback(entity)
    }
}