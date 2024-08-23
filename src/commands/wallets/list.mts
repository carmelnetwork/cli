import { logger } from "@/core/utils.mts"
import { listWallets } from "@/core/wallets.mjs"

export const run = async ({ name }: any) => {
    logger(`listing wallets ...`, 'wallets')

    const names = await listWallets()

    if (names.length == 0) {
        logger(`No wallets yet`, 'wallets')
        return 
    }

    logger(`found ${names.length} wallets:`)

    names.map((id: string, i: number) => {
        logger(`wallet #${i}: [${id}]`)
    })
}

export const options = () => {
    return []
}

export const description = "list wallets"