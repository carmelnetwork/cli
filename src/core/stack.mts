import * as pulumi from "@pulumi/pulumi"
import { logger } from "./utils.mts"
import path from 'path'

const CARMEL_DIR = `${process.env.CARMEL_DIR}`

export const stackUp = async ({ name, project }: any) => {
    const args: pulumi.automation.LocalProgramArgs = {
        stackName: name,
        workDir: path.resolve('.')
    }

    // output everything nicely
    const onOutput = (msg: string) => logger(msg)

    // get a reference to the stack
    const stackRef = await pulumi.automation.LocalWorkspace.createOrSelectStack(args)

    // ensure the setting are part of the stack
    await stackRef.setConfig("carmelDir", { value: CARMEL_DIR })

    // // refresh the stack
    await stackRef.refresh({ onOutput })

    // bring it up
    const result = await stackRef.up({ onOutput })

    return result
} 
