import { JSONFilePreset } from 'lowdb/node'
import { stackUp } from "./stack.mts"
import path from 'path'

const CARMEL_HOME = `${process.env.CARMEL_HOME}`

export const nodesDb = async () => {
  const dbFile = path.resolve(CARMEL_HOME, '.carmel', 'nodes.json')
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

export const createNode = async ({ name, config, domain, stack, eth, project, provider, wallet, ssh, sshKey, ssl }: any) => {
  const db = await nodesDb()

  const details = { 
    config, provider, wallet, sshSlot: ssh, domain, sshPublicKey: sshKey.public, ethSlot: eth, ssl
  }
  
  db.data[name] = {
    name, ...details
  }

  await db.write()
  
  await stackUp({ name: stack, project, config, domain })

  await db.read()

  return db.data[name]
}