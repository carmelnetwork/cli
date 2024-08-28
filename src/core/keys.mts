import { JSONFilePreset } from 'lowdb/node'
import path from 'path'
import ssh from 'ssh2'
import { logger } from "./utils.mts"
import { openWallet } from './wallets.mts'

const CARMEL_HOME = `${process.env.CARMEL_HOME}`

export const keysDb = async () => {
  const dbFile = path.resolve(CARMEL_HOME, '.carmel', 'keys.json')
  const db = await JSONFilePreset(dbFile, { } as any)

  return db
}

export const createSshKey = async ({ wallet, name }: any) => {
  let wal = wallet || await openWallet(name)

  const sshKey = ssh.utils.generateKeyPairSync("ed25519")
  sshKey.private = Buffer.from(sshKey.private).toString('base64')

  const { db } = wal
  db.data[name].ssh = db.data[name].ssh || []
  db.data[name].ssh.push(sshKey)

  await db.write()

  logger(`SSH Key successfully created: ${sshKey.public}`)

  return sshKey
}

export const listKeys = async () => {
  const db = await keysDb()
  const names = Object.keys(db.data)

  return names
}

export const keyExists = async (name: string) => {
  const db = await keysDb()
  return db.data[name] ? true : false
}