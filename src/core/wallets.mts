import { Wallet } from 'alchemy-sdk'
import { HDNode } from "@ethersproject/hdnode";
import { JSONFilePreset } from 'lowdb/node'
import path from 'path'

const CARMEL_DIR = `${process.env.CARMEL_DIR}`

const nodeDetails = (node: HDNode) => {
    const xpriv = node.extendedKey
    const { publicKey, privateKey, address } = node 

    return {
        publicKey, privateKey, address, xpriv
    }
}

export const walletsDb = async () => {
  const dbFile = path.resolve(CARMEL_DIR, 'wallets.json')
  const db = await JSONFilePreset(dbFile, { } as any)

  return db
}

export const openWallet = async (name: string) => {
  const db = await walletsDb()
  const details = db.data[name]    
  
  if (!details) {
    return 
  }

  const { xpriv } = details
  const node = HDNode.fromExtendedKey(xpriv)

  return { node, ...details }
}

export const getKey = async (node: HDNode, batch: number, slot: number) => {
  const keyNode = node.derivePath(`m/44'/60'/${batch}'/0/${slot}`)
  const { privateKey, address } = nodeDetails(keyNode)

  return {
    address,
    privateKey,
    batch,
    slot
  }
}

export const createWallet = async ({ name }: any) => {
    const wallet = Wallet.createRandom()
    const { phrase } = wallet.mnemonic
    
    const db = await walletsDb()

    const node = HDNode.fromMnemonic(phrase)
    const details = nodeDetails(node)
    
    db.data[name] = {
      name, ...details
    }

    await db.write()
}