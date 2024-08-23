import { logger } from "@/core/utils.mts"
import { listNodes } from "@/core/nodes.mjs"
import * as dotenv from 'dotenv'

dotenv.config()

export const run = async ({ stack, project }: any) => {
    logger(`checking nodes [${project}/${stack}] ...`, 'nodes')

    const names = await listNodes()

    if (names.length == 0) {
        logger(`No nodes yet`, 'nodes')
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
        { id: "project", description: "the project", default: "carmel" }
    ]
}

export const description = "checking nodes status"