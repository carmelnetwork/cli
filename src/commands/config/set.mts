import { logger } from "~/core/utils.mts"
import { setConfig } from "~/core/config.mts"

export const run = async ({ name, value }: any) => {
    logger(`creating a new config ...`, 'config')

    await setConfig({ name, value })
}

export const options = () => {
    return [
        { id: "name", description: "the name of the config" },
        { id: "value", description: "the value of the config" }
    ]
}

export const description = "create a config"