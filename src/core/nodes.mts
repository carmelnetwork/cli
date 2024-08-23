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

export const createNode = async ({ name, config, stack, project, provider, wallet, ssh, sshKey }: any) => {
  // const db = await nodesDb()

  // const details = { 
  //   config, provider, wallet, sshSlot: ssh, sshPublicKey: sshKey.public
  // }
  
  // db.data[name] = {
  //   name, ...details
  // }

  // await db.write()
  
  await stackUp({ name: stack, project })
}