import * as commands from "../commands/index.mts"
import { Command } from "commander"
import figlet from 'figlet'
import { logger } from "./utils.mts"

const init = async (options: any) => {
    logger(`initializing ...`)
}

const coreRun = (run: any, cmdId: string, subcmdId: string) => async (options: any) => {
  console.log(figlet.textSync(`carmel`))

  await init(options)
  await run(options)
}

const createSubcommand = ({ cmd, cmdId, subcommands, subcmdId }: any) => {
  const { description, run, options } = (subcommands as any)[subcmdId]

  let subcmd = cmd.command(subcmdId)
  subcmd.description(description)

  options().map((opt: any) => {
    subcmd = subcmd.option(`--${opt.id} <${opt.id}>`, opt.description, opt.default)
  })

  subcmd.action(coreRun(run, cmdId, subcmdId))
 
  return { subcmd }
}

const createCommand = ({ main, cmdId }: any) => {
  const subcommands = (commands as any)[cmdId]

  let cmd = main.command(cmdId).argument(`<action>`)
  cmd.description(`manage ${cmdId}`)

  Object.keys(subcommands).map((subcmdId: string) => {  
    createSubcommand({ subcommands, cmdId, cmd, subcmdId })    
  })
}

const load = async (main: any) => {
  Object.keys(commands).map((cmdId: string) => createCommand({ cmdId, main }))
}

export const start = async () => {  
  let main = new Command()

  main.name('carmel').description('carmel').version('1.0.0')

  await load(main)
  await main.parseAsync(process.argv)
  
  process.exit(0)
}