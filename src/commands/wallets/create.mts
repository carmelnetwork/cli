import { logger } from "@/core/utils.mts"
import { createWallet } from "@/core/wallets.mjs"

export const run = async ({ name }: any) => {
    logger(`creating a new wallet ...`, 'wallets')
    const wallet = await createWallet({ name })
    console.log(wallet)
}

export const options = () => {
    return [
        { id: "name", description: "the name of the wallet", default: "main" }
    ]
}

export const description = "creating a new key"