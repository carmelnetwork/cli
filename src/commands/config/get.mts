import { logger } from "~/core/utils.mts"
import { getConfig } from "~/core/config.mts"

export const run = async ({ name }: any) => {
    logger(`getting a config ...`, 'config')

    const c = await getConfig({ name })

    if (!c) {
        logger(`No config available`, `config`)
        return 
    }

    logger(`${name}=${c}`, 'config')
}

export const options = () => {
    return [
        { id: "name", description: "the name of the config" }
    ]
}

export const description = "get a config"