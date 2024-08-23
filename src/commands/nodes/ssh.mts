import ssh from 'ssh2'
import readline from 'readline'
import { logger, sendFilesToNode } from "@/core/utils.mts"
import { getNode } from "@/core/nodes.mjs"
import { getSshKey } from "@/core/wallets.mjs"

export const run = async ({ name }: any) => {
    logger(`attempting to ssh into the ${name} node ...`, 'nodes')

    const node = await getNode(name)

    if (!node) {
        logger(`the ${name} node does not exist`, 'nodes')
        return 
    }

    const key = await getSshKey(undefined, node.wallet, node.sshSlot)
    const privateKey = Buffer.from(key.private, 'base64').toString('utf-8')
    const conn = new ssh.Client()

    return new Promise((done: any, onError: any) => {
        conn.on('ready', () => {
            conn.shell((err, stream) => {
                if (err) {
                    onError(err)
                    return 
                }

                let line = readline.createInterface(process.stdin, process.stdout)

                stream.on('close', function() {
                    process.stdout.write('connection closed')
                    conn.end()
                    done()
                  }).on('data', (data: any) => {
                    process.stdin.pause()
                    process.stdout.write(data)
                    process.stdin.resume()
                  }).stderr.on('data', (data: any) => {
                    process.stderr.write(data)
                    console.log(data)
                    onError(data)
                  })

                  line.on('line', (d: any) => {
                    stream.write(d.trim() + '\n')
                  })

                  line.on('SIGINT', function () {
                    process.stdin.pause()
                    line.close()
                    stream.end('exit\n')
                  })
            });

        }).connect({
            host: node.ip,
            port: 22,
            username: 'carmel',
            privateKey
        })
    })
}

export const options = () => {
    return [
        { id: "name", description: "the name of the node", default: "main" }
    ]
}

export const description = "ssh into a node"