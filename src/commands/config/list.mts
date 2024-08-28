import { logger } from "~/core/utils.mts"
import { listConfig, configDb } from "~/core/config.mjs"

export const run = async ({ name }: any) => {
    logger(`listing config ...`, 'config')

    const names = await listConfig()

    if (names.length == 0) {
        logger(`No config yet`, 'config')
        return 
    }

    const db = await configDb()

    names.map((id: string, i: number) => {
        logger(`${id}=${db.data[id]}`)
    })
}

export const options = () => {
    return []
}

export const description = "list config"