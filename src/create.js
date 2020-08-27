import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import symbols from 'log-symbols'
import inquirer from 'inquirer'

import downloadTpl from './utils/downloadTpl'
import { getAll } from './utils/opration'
import { getRepos, getTags } from './utils/getRepo'

module.exports = async function create(projectName, templateName, options = {clone: false}) {
  if (!fs.existsSync(projectName)) {
    const spiner = ora()
    try {
      const answer = await inquirer.prompt([
        {
          name: 'description',
          message: 'Please enter the project description: '
        },
        {
          name: 'author',
          message: 'Please enter the author name: '
        }
      ])
      const config = await getAll()
      let repoResult = {}
      let tagResult = {}
      if (!templateName && config.type === 'github') {
        spiner.text = 'get repos...'
        spiner.start()
        const repos = await getRepos()
        spiner.stop()
        repoResult = await inquirer.prompt([
          {
            type: 'list',
            name: 'repo',
            message: '选择repo',
            choices: repos
          }
        ])
        spiner.text = 'get tags...'
        spiner.start()
        const tags = await getTags(repoResult.repo)
        spiner.stop()
        tagResult = tags.length && await inquirer.prompt([
          {
            type: 'list',
            name: 'tag',
            message: '选择tag',
            choices: tags
          }
        ])

      }
      spiner.text = 'downloading template...'
      spiner.start()
      const name = templateName || repoResult.repo || config.templateName
      const url = `${config.type}:${config.origin}:${config.owner}/${name}#${tagResult.tag || options.checkout || config.checkout}`
      await downloadTpl(url, options, projectName)
      const filename = `${projectName}/package.json`
      if (fs.existsSync(filename)) {
        const data = fs.readFileSync(filename).toString()
        let json = JSON.parse(data)
        json.name = projectName
        json.author = answer.author
        json.description = answer.description
        fs.writeFileSync(filename, JSON.stringify(json, null, 2), 'utf-8')
      }
      spiner.stop()
      console.log(symbols.success, chalk.green('Project initialization finished!'))
    } catch (error) {
      spiner.stop()
      console.log(chalk.red(`downloadTpl ${error}`))
    }
  } else {
    console.log(symbols.error, chalk.red('The project already exists'))
  }
}