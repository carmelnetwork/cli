import { Wallet } from 'alchemy-sdk'
import { HDNode } from "@ethersproject/hdnode"
import { JSONFilePreset } from 'lowdb/node'
import path from 'path'
import ssh from 'ssh2'

const CARMEL_HOME = `${process.env.CARMEL_HOME}`

const nodeDetails = (node: HDNode) => {
    const xpriv = node.extendedKey
    const { publicKey, privateKey, address } = node 

    return {
        publicKey, privateKey, address, xpriv
    }
}

export const walletsDb = async () => {
  const dbFile = path.resolve(CARMEL_HOME, '.carmel', 'wallets.json')
  const db = await JSONFilePreset(dbFile, { } as any)

  return db
}

export const listWallets = async () => {
  const db = await walletsDb()
  const names = Object.keys(db.data)

  return names
}

export const walletExists = async (name: string) => {
  const db = await walletsDb()
  return db.data[name] ? true : false
}

export const openWallet = async (name: string) => {
  const db = await walletsDb()
  const details = db.data[name]    
  
  if (!details) {
    return 
  }

  const { xpriv } = details
  const node = HDNode.fromExtendedKey(xpriv)

  return { node, db, ...details }
}

export const getSshKey = async (wallet: any, name: string, slot: number) => {
  let db = wallet ? wallet.db : await walletsDb()
  const all = db.data[name].ssh

  if (!all || all.length == 0 || all.length < slot) {
    return
  }

  return all[slot]
}

export const getEthKey = async (wallet: any, name: string, slot: number) => {
  let wal = wallet || await openWallet(name)
  const { node } = wal
  const keyNode = node.derivePath(`m/44'/60'/0'/0/${slot}`)
  const { privateKey, address } = nodeDetails(keyNode)

  return {
    address,
    privateKey,
    slot
  }
}

export const createWallet = async ({ name }: any) => {
    const wallet = Wallet.createRandom()
    const { phrase } = wallet.mnemonic
    
    const db = await walletsDb()

    const node = HDNode.fromMnemonic(phrase)
    const details = nodeDetails(node)

    const sshKey = ssh.utils.generateKeyPairSync("ed25519")
    sshKey.private = Buffer.from(sshKey.private).toString('base64')
  
    db.data[name] = {
      name, ...details, ssh: [sshKey]
    }

    await db.write()
    
    return { phrase }
}