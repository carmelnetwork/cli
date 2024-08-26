import debug from 'debug'
import path from 'path'
import fs from 'fs-extra'
import scp from 'node-scp'
import { getSshKey } from './wallets.mts'

const LOG = debug("carmel")
const CARMEL_HOME = `${process.env.CARMEL_HOME}`

export const logger = (msg: string, func: string = '') => msg.trim() && (func ? LOG(`[${func}]`, msg) : LOG(msg))

export const stopWithError = (msg: string, func: string = '') => {
    logger(`Error: ${msg}`, func)
    process.exit(1)
}

export const uploadNodeFiles = async (node: any, files: string[][]) => {    
    const key = await getSshKey(undefined, node.wallet, node.sshSlot)
    
    if (!key) {
        return 
    }

    const privateKey = Buffer.from(key.private, 'base64').toString('utf-8')

    return new Promise(async (done, onError) => {
        try {
            logger('trying to connect ...')
 
            const client = await scp.Client({
                host: node.ip,
                port: 22,
                username: 'carmel',
                privateKey
            })

            logger('connected; now trying to upload files ...')
    
            const res = await Promise.all((files.map((file: any) => {
                return client.uploadFile(file[0], file[1])
            })))

            logger(`uploading ${res.length} files`)

            client.close()
            done(true)
        } catch (e) {
            setTimeout(async () => {
                await uploadNodeFiles(node, files)
                done(true)
            }, 5000)
        }
    })
}

export const sendFilesToNode = async (node: any) => {
    if (!node) {
        return 
    }

    const sslDir = path.resolve(CARMEL_HOME, '.carmel', 'ssl')
    const keyFile = path.resolve(sslDir, `${node.ssl}.key`)
    const certFile = path.resolve(sslDir, `${node.ssl}.cert`)

    if (node.ssl && fs.existsSync(keyFile) && fs.existsSync(certFile)) {
        await uploadNodeFiles(node, [[keyFile, '/home/carmel/.ssl/main.key'], [certFile, '/home/carmel/.ssl/main.cert']])
    }
}