import { openWallet, getEthKey, getSshKey } from "~/core/wallets.mjs"
import { logger } from "~/core/utils.mts"

const ethKey = async ({ wallet, name, slot }: any) => {
    const key = await getEthKey(wallet, name, slot)

    const { address, privateKey } = key

    logger(`slot: ${slot}`)
    logger(`address: ${address}`)
    logger(`privateKey: ${privateKey}`)

    return key
}

const sshKey = async ({ wallet, name, slot }: any) => {
    const key = await getSshKey(wallet, name, slot)

    if (!key) {
        logger('SSH Key Not found', 'keys')
        return
    }

    logger(`slot: ${slot}`)
    logger(`publicKey: ${key.public}`)
    logger(`privateKey: ${key.private}`)

    return key
}

export const run = async ({ id }: any) => {
    logger(`getting ${id}] key ...`, 'keys')

    const [name, alg, slot] = id.split('/')

    if (!name || !alg || !slot) {
        logger('invalid key id', `keys`)
        return
    }

    const wallet = await openWallet(name)

    if (!wallet) {
        logger(`invalid wallet: ${name}`, `keys`)
        return
    }

    switch (alg) {
        case "eth":
            return ethKey({ wallet, name, slot })
        case "ssh":
            return sshKey({ wallet, name, slot })
    }

    logger(`Invalid key type: ${alg}`)
}

export const options = () => {
    return [
        { id: "id", description: "the id of the key", default: "main/eth/0" }
    ]
}

export const description = "get a key"