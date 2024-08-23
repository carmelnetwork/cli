import { logger } from "@/core/utils.mts"
import { createNode, nodeExists } from "@/core/nodes.mjs"
import { getSshKey, openWallet } from "@/core/wallets.mjs"

export const run = async ({ name, config, provider, wallet, ssh, stack, project }: any) => {
    logger(`creating a new ${config} node on ${provider} with name=${name}, wallet=${wallet} and ssh=${ssh} ...`, 'nodes')

    const exists = await nodeExists(name)

    if (exists) {
        // logger(`the [${name}] node already exists`, 'nodes')
        // return 
    }

    const walletRef = await openWallet(wallet)

    if (!walletRef) {
        logger(`the [${wallet}] wallet does not exist`, 'nodes')
        return 
    }

    const sshKey = await getSshKey(walletRef, wallet, ssh)

    if (!sshKey) {
        logger(`the ssh key #${ssh} does not exist in the ${wallet} wallet`, 'nodes')
        return 
    }
    
    await createNode({ name, config, provider, wallet, ssh, sshKey, stack, project })

    logger(`Done`)
}

export const options = () => {
    return [
        { id: "stack", description: "the pulumi stack", default: "main" },
        { id: "project", description: "the pulumi project", default: "carmel" },
        { id: "name", description: "the name of the wallet", default: "main" },
        { id: "config", description: "the node configuration", default: "relay" },
        { id: "provider", description: "the infrastructure provider", default: "hcloud" },
        { id: "wallet", description: "the node wallet", default: "main" },
        { id: "ssh", description: "the ssh key to use", default: "0" }
    ]
}

export const description = "create a wallet"