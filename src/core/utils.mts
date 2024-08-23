import debug from 'debug'

const LOG = debug("carmel")

export const logger = (msg: string, func: string = '') => msg.trim() && (func ? LOG(`[${func}]`, msg) : LOG(msg))

export const stopWithError = (msg: string, func: string = '') => {
    logger(`Error: ${msg}`, func)
    process.exit(1)
}