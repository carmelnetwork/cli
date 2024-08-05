import debug from 'debug'

const LOG = debug("carmel")

export const logger = (msg: string, func: string = '') => func ? LOG(`[${func}]`, msg) : LOG(msg)