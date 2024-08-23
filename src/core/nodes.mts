import { JSONFilePreset } from 'lowdb/node'
import { stackUp } from "./stack.mts"
import path from 'path'

const CARMEL_DIR = `${process.env.CARMEL_DIR}`

export const nodesDb = async () => {
  const dbFile = path.resolve(CARMEL_DIR, '.carmel', 'nodes.json')
  const db = await JSONFilePreset(dbFile, { } as any)

  return db
}

export const listNodes = async () => {
  const db = await nodesDb()
  const names = Object.keys(db.data)

  return names
}

export const nodeExists = async (name: string) => {
  const db = await nodesDb()
  return db.data[name] ? true : false
}

export const getNode = async (name: string) => {
  const db = await nodesDb()
  return db.data[name]
}

export const createNode = async ({ name, config, stack, eth, project, provider, wallet, ssh, sshKey, ssl }: any) => {
  const db = await nodesDb()

  const details = { 
    config, provider, wallet, sshSlot: ssh, sshPublicKey: sshKey.public, ethSlot: eth, ssl
  }
  
  db.data[name] = {
    name, ...details
  }

  await db.write()
  
  await stackUp({ name: stack, project })

  await db.read()

  return db.data[name]
}