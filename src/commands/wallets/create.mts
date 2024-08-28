import { logger } from "~/core/utils.mts"
import { createWallet, walletExists } from "~/core/wallets.mjs"

export const run = async ({ name }: any) => {
    logger(`creating a new wallet ...`, 'wallets')
    const exists = await walletExists(name)

    if (exists) {
        logger(`the [${name}] wallet already exists`, 'wallets')
        return 
    }

    const { phrase } = await createWallet({ name })
    logger(`Done. Save this phrase: ${phrase}`, 'wallets')
}

export const options = () => {
    return [
        { id: "name", description: "the name of the wallet", default: "main" }
    ]
}

export const description = "create a wallet"