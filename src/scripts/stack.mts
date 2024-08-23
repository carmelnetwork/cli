import { nodesDb } from "../core/nodes.mts"
import pulumi from "@pulumi/pulumi"
import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'
import hcloud from "@pulumi/hcloud"

const DEFAULT_HCLOUD_DATACENTER = "hel1"
const DEFAULT_HCLOUD_TYPE = "ccx13"
const DEFAULT_HCLOUD_IMAGE = "ubuntu-24.04"

// const newVultrInstance = (data: any) => {
//     const userData = cloudInit(data)
//     const instance = new vultr.Instance("my-vultr-instance", {
//         osId: 167, // Ubuntu 20.04 x64
//         plan: "vc2-1c-1gb", // Plan type
//         region: "ewr", // Region code
//         label: "my-instance",
//         hostname: "my-instance",
//         userData, // Cloud-Init script
//         sshKeyIds: ["your-ssh-key-id"], // Replace with your SSH key ID
//         enableIpv6: true,
//     })
//     return instance
// }

const deployHcloudNode = async (db: any, name: string, config: any) => {
    const node = db.data[name]
    console.log(`Deploying node ${node.name} to an hcloud ...`)

    const carmelDir = config.require("carmelDir")
    const resDir = path.resolve(carmelDir, 'res')
    
    const cloudInitTplRaw = fs.readFileSync(path.resolve(resDir, 'cloud-init.tpl'), 'utf-8')
    const cloudInitTpl = ejs.compile(cloudInitTplRaw, {})
    
    const userData = cloudInitTpl({ node })

    const keyName = `${node.name}-${node.sshSlot}`

    const key = new hcloud.SshKey(keyName, {
        name: keyName,
        publicKey: node.sshPublicKey
    })

    console.log("ssh key ready")

    const instance = new hcloud.Server(node.name, {
        sshKeys: [keyName],
        userData,
        name: node.name,
        serverType: DEFAULT_HCLOUD_TYPE,
        image: DEFAULT_HCLOUD_IMAGE,
        location: DEFAULT_HCLOUD_DATACENTER,
    })

    const status = await new Promise((resolve) => instance.status.apply(resolve))
    const ip = await new Promise((resolve) => instance.ipv4Address.apply(resolve))

    const timestamp = `${Date.now()}`

    db.data[name] = { ...node, status, ip, timestamp }
    await db.write()
        
    console.log("instance ready")
}

const deployNode = async (db: any, name: string, config: any) => {
    const node = db.data[name]
    const { provider } = node

    switch(provider) {
        case "hcloud":
            return deployHcloudNode(db, name, config)
    }
}

const run = async () => {
    let config = new pulumi.Config();

    const db = await nodesDb()
    
    if (!db || !db.data || Object.keys(db.data).length == 0) {
        console.log("No nodes yet")
        return 
    }

    await Promise.all(Object.keys(db.data).map((name: string) => deployNode(db, name, config)))
}

run()