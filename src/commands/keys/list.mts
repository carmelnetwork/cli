import { logger } from "@/core/utils.mts"
import { openWallet, getKey } from "@/core/wallets.mjs"

export const run = async ({ id }: any) => {
    logger(`listing ...`, 'keys')

    const [name, batch, slot] = id.split('/')

    if (!name || !batch || !slot) {
        logger('invalid key id', `keys`)
        return
    }

    const wallet = await openWallet(name)

    if (!wallet) {
        logger(`invalid wallet: ${name}`, `keys`)
        return
    }

    const { node } = wallet 
    const key = await getKey(node, batch, slot)

    const { address, privateKey } = key

    logger(`batch: ${batch}`)
    logger(`slot: ${slot}`)
    logger(`address: ${address}`)
    logger(`privateKey: ${privateKey}`)

    return key
}

export const options = () => {
    return [
        { id: "id", description: "the id of the key", default: "main/0/0" }
    ]
}

export const description = "listing keys"