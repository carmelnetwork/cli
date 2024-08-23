import { logger, stopWithError } from "@/core/utils.mts"
import * as pulumi from "@pulumi/pulumi"
import path from 'path'
import fs from 'fs-extra'
import * as ejs from 'ejs'
import * as dotenv from 'dotenv'
import * as hcloud from "@pulumi/hcloud"
import { hostname } from "os"
import * as std from "@pulumi/std";
import ssh from 'ssh2'
import { listNodes } from "@/core/nodes.mjs"

dotenv.config()

const CARMEL_DIR = `${process.env.CARMEL_DIR}`

// const DEFAULT_HCLOUD_DATACENTER = "hel1-dc2"
// const DEFAULT_HCLOUD_TYPE = "ccx13"
// const DEFAULT_HCLOUD_IMAGE = "ubuntu-24.04"
// const DEFAULT_HCLOUD_SSL_NAME = "main"

const getResource = (name: string) => {
    const resPath = path.resolve('res', name)

    if (!fs.existsSync(resPath)) {
        // The resource does not exist
        stopWithError(`the [${name}] resource does not exist`)
        return 
    }

    return fs.readFileSync(resPath, 'utf-8')
}

const getResources = (...names: string[]) => {
    return names.map((name: string) => getResource(name))
}

// const getKey = (name: string) => {
//     const keyPath = path.resolve('.keys', name)

//     if (!fs.existsSync(keyPath)) {
//         // The key does not exist
//         return 
//     }

//     return fs.readFileSync(keyPath, 'utf-8')
// }

// const cloudInit = (data: any) => {
    // const [sshkey, tpl] = getResources('hcloud.pub', 'cloud-init.tpl')

    // console.log({
        // sshkey, tpl
    // })

    // const cloudInitTplPath = path.resolve('res', 'cloud-init.tpl')
    // const cloudInitTplRaw = fs.readFileSync(cloudInitTplPath, 'utf-8')
    // const cloudInitTpl = ejs.compile(cloudInitTplRaw, {})

    // const sshkey = fs.readFileSync(`./.keys/hcloud.pub`, `utf-8`)

    // return cloudInitTpl({
    //     ...data,
    //     sshkey
    // })
// }

// const newHCloudInstance = (data: any) => {
    // const userData = cloudInit(data)

    // const instance = new hcloud.Server(data.hostname, {
    //     serverType: DEFAULT_HCLOUD_TYPE,
    //     image: DEFAULT_HCLOUD_IMAGE,
    //     sshKeys: [DEFAULT_HCLOUD_SSL_NAME],
    //     location: DEFAULT_HCLOUD_DATACENTER,
    //     userData,
    // })

    // return instance
// }

// const program = async () => {
//     logger("running program", "nodes")

//     const hostname = 'relay-0'
//     const sshkeyName = 'hcloud.pub'

//     const [sshkey, tpl] = getResources(sshkeyName, 'cloud-init.tpl')
//     const cloudInitTpl = ejs.compile(tpl!, {})

    // const userData = cloudInitTpl({ sshkey, hostname })

    // const instance = new hcloud.Server(hostname, {
    //     serverType: DEFAULT_HCLOUD_TYPE,
    //     image: DEFAULT_HCLOUD_IMAGE,
    //     sshKeys: [DEFAULT_HCLOUD_SSL_NAME],
    //     location: DEFAULT_HCLOUD_DATACENTER,
    //     userData,
    // })

    // console.log(instance)

    // console.log(process.env.HCLOUD_TOKEN)
    

    // const resPath = path.resolve('res', 'hcloud.pub')

    // const key = new hcloud.SshKey("default", {
    //     name: "Terraform Example",
    //     publicKey: std.file({
    //         input: path.resolve('res', 'hcloud.pub'),
    //     }).then(invoke => invoke.result),
    // })

    // const key = await hcloud.getSshKey({
    //     name: "main",
    // });

    // const key = new hcloud.SshKey("default", {
    //     name: "Main Key",
    //     publicKey: sshkey!,
    // })

    // // const key = new hcloud.SshKey.get("default")
//     console.log(key)
// }    

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

    // const args: pulumi.automation.LocalProgramArgs = {
    //     stackName: stack,
    //     workDir: path.resolve('network')
    // };

    // // output everything nicely
    // const onOutput = (msg: string) => logger(msg, 'nodes')

    // // get a reference to the stack
    // const stackRef = await pulumi.automation.LocalWorkspace.createOrSelectStack(args)

    // // ensure the setting are part of the stack
    // // await stackRef.setConfig("HCLOUD_TOKEN", { value: process.env.HCLOUD_TOKEN })

    // // refresh the stack
    // await stackRef.refresh({ onOutput })

    // bring it up
    // const result = await stackRef.up({ onOutput })

    // return result
}

export const options = () => {
    return [
        { id: "stack", description: "the stack", default: "main" },
        { id: "project", description: "the project", default: "carmel" }
    ]
}

export const description = "checking nodes status"