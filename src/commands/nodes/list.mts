import { logger } from "~/core/utils.mts"
import { listNodes, nodesDb } from "~/core/nodes.mjs"
import * as dotenv from 'dotenv'

dotenv.config()

export const run = async ({ stack, project, name }: any) => {
    logger(`checking nodes [${project}/${stack}] ...`, 'nodes')

    const names = await listNodes()

    if (names.length == 0) {
        logger(`No nodes yet`, 'nodes')
        return 
    }

    if (name) {
        const db = await nodesDb()
        
        if (!db.data[name]) {
            logger(`the ${name} node does not exist`, 'nodes')
            return 
        }

        Object.keys(db.data[name]).map((b: string) => logger(`${b}=${db.data[name][b]}`, `${name}`))
        return 
    }

    logger(`found ${names.length} nodes:`)

    names.map((id: string, i: number) => {
        logger(`node #${i}: [${id}]`)
    })
}

export const options = () => {
    return [
        { id: "stack", description: "the stack", default: "main" },
        { id: "project", description: "the project", default: "carmel" },
        { id: "name", description: "the name of the node", default: "" }
    ]
}

export const description = "checking nodes status"