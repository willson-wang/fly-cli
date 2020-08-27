import fs from 'fs-extra'
import { decode, encode } from 'ini'

import { RC, DEFAULT_CONFIG } from './constans'
import chalk from 'chalk'

async function getRc() {
  let config = {}
  const isExist = await fs.exists(RC)
  if (!isExist) {
    try {
      await fs.outputFile(RC, encode(DEFAULT_CONFIG), 'utf8')
    } catch (error) {
      console.log(chalk.red(`getRc outputFile ${error}`))
    }
  }
  try {
    config = decode((await fs.readFile(RC)).toString())
  } catch (error) {
    console.log(chalk.red(`getRc readFile ${error}`))
  }
  return config
}

export async function getAll() {
  const config = await getRc()
  return config
}

export async function get(key) {
  if (!key) {
    console.log(chalk.red(chalk.bold('Error:')), chalk.red('key is required'))
    return
  }
  const config = await getRc()
  return config[key]
}

export async function set(key, val) {
  if (!key) {
    console.log(chalk.red(chalk.bold('Error:')), chalk.red('key is required'))
    return
  }
  if (!val) {
    console.log(chalk.red(chalk.bold('Error:')), chalk.red('value is required'))
    return
  }
  const config = await getRc()
  config[key] = val
  try {
    await fs.outputFile(RC, encode(config), 'utf8')
    console.log(chalk.green(`set ${key}=${val} succ`))
  } catch (error) {
    console.log(chalk.red(chalk.bold('Error:')), chalk.red(`set ${key} ${error}`))
  }
}

export async function remove(key) {
  if (!key) {
    console.log(chalk.red(chalk.bold('Error:')), chalk.red('key is required'))
    return
  }

  const config = await getRc()
  delete config[key]

  try {
    await fs.outputFile(RC, encode(config), 'utf8')
    console.log(chalk.green(`remove ${key}=${val} succ`))
  } catch (error) {
    console.log(chalk.red(chalk.bold('Error:')), chalk.red(`remove ${key} ${error}`))
  }
}

