import program from "commander"
import chalk from 'chalk'

import { VERSION } from './utils/constans'

const actionMap = {
  config: {
    description: 'config .flyrc',
    usages: [
      'fly config set <key> <val>',
      'fly config get <key>',
      'fly config remove <key>',
      'fly config list'
    ]
  }
}

program.command('create')
    .description('generate a new project from a template')
    .option('-c, --clone', 'Use git clone when fetching remote preset')
    .usage([
      'fly create <projectName> [templateName]'
    ])
    .action((cmd) => {
      const options = cleanArgs(cmd)
      if (!cmd.args.length) {
        console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the project\'s name, the rest are ignored.'))
        return
      }
      console.log('args', cmd.args)
      require('./create')(cmd.args[0], cmd.args[1], options)
    })
  

Object.keys(actionMap).forEach((action) => {
  program.command(action)
    .description(actionMap[action].description)
    .action((...args) => {
      console.log('args', ...args)
      switch(action) {
        case 'config':
          require('./config')(...process.argv.slice(3))
          break;
      }
    })
})

function help() {
  console.log('\r\nUsage:')
  console.log('  - ' + 'fly create <projectName> [templateName]');
  Object.keys(actionMap).forEach((action) => {
    actionMap[action].usages.forEach((usage) => {
      console.log('  - ' + usage);
    })
  })
  console.log('\r');
}

program.usage('<command> [options]')
program.on('-h', help)
program.on('--help', help)
program.version(VERSION, '-V --version').parse(process.argv)

if (!process.argv.slice(2)) {
  program.outputHelp((txt) => {
    chalk.green(txt)
  })
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}