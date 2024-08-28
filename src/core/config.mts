import { JSONFilePreset } from 'lowdb/node'
import path from 'path'
import fs from 'fs-extra'

const CARMEL_HOME = `${process.env.CARMEL_HOME}`

export const configDb = async () => {
  const dbFile = path.resolve(CARMEL_HOME, '.carmel', 'config.json')
  const db = await JSONFilePreset(dbFile, { } as any)

  return db
}

export const listConfig = async () => {
  const db = await configDb()
  const names = Object.keys(db.data)

  return names
}

export const setConfig = async ({ name, value }: any) => {
    const db = await configDb()
    const names = Object.keys(db.data)
  
    db.data[name] = value

    await db.write()

    let data = ''
    Object.keys(db.data).map((name: string) => {
      data = `${data ? "\n" : ''}${name}=${db.data[name]}`
    })

    fs.writeFileSync(path.resolve(CARMEL_HOME, '.env'), data)
}

export const getConfig = async ({ name }: any) => {
    const db = await configDb()  
    return db.data[name]
}