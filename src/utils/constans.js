import os from 'os'

import { version } from '../../package.json'

export const VERSION = version

export const HOME = os.homedir()

export const RC = `${HOME}/.flyrc`

export const DEFAULT_CONFIG = {
  type: 'github',
  origin: 'github.com',
  owner: 'willson-wang',
  checkout: 'master',
  projectName: 'react-curd'
}