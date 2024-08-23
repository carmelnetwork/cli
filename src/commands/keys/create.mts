import { openWallet } from "@/core/wallets.mjs"
import { createSshKey } from "@/core/keys.mjs"
import { logger } from "@/core/utils.mts"

export const run = async ({ config }: any) => {
    logger(`creating a new ${config}] key ...`, 'keys')

    const [name, alg] = config.split('/')

    if (!name || !alg) {
        logger('invalid key id', `keys`)
        return
    }

    const wallet = await openWallet(name)

    if (!wallet) {
        logger(`invalid wallet: ${name}`, `keys`)
        return
    }

    switch (alg) {
        case "ssh":
            return createSshKey({ wallet, name })
    }

    logger(`Invalid key type: ${alg}`)
}

export const options = () => {
    return [
        { id: "config", description: "the type of the key", default: "main/ssh" }
    ]
}

export const description = "add a new key"