import { logger, sendFilesToNode } from "@/core/utils.mts"
import { createNode, nodeExists } from "@/core/nodes.mjs"
import { getSshKey, openWallet } from "@/core/wallets.mjs"

export const run = async ({ name, config, provider, domain, wallet, ssh, stack, project, eth, ssl }: any) => {
    logger(`creating a new ${config} node on ${provider} with name=${name}, ssl=${ssl}, wallet=${wallet}, ssh=${ssh} and eth=${eth} ...`, 'nodes')

    const exists = await nodeExists(name)

    if (exists) {
        logger(`the [${name}] node already exists`, 'nodes')
        return
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
 
    const node = await createNode({ name, config, provider, wallet, domain, ssh, sshKey, stack, project, eth, ssl })

    await sendFilesToNode(node)

    logger(`done`)
}

export const options = () => {
    return [
        { id: "stack", description: "the pulumi stack", default: "main" },
        { id: "domain", description: "the node domain", default: "" },
        { id: "project", description: "the pulumi project", default: "carmel" },
        { id: "name", description: "the name of the wallet", default: "main" },
        { id: "config", description: "the node configuration", default: "relay" },
        { id: "provider", description: "the infrastructure provider", default: "hcloud" },
        { id: "wallet", description: "the node wallet", default: "main" },
        { id: "ssh", description: "the ssh key to use", default: "0" },
        { id: "ssl", description: "the ssl to use", default: "" },
        { id: "eth", description: "the eth key to use", default: "0" }
    ]
}

export const description = "create a node"