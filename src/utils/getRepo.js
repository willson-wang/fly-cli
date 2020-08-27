import axios from 'axios'
import chalk from 'chalk'
import { getAll } from './opration'

// 获取github某个user下面的repo
// https://api.github.com/users/${user}/repos
export async function getRepos() {
  let result = []
  try {
    const config = await getAll()
    const res = await axios.request({
      url: `https://api.github.com/users/${config.owner}/repos`,
      method: 'GET'
    })
    result = res.data.map((item) => {
      return item.name
    })
  } catch(e) {
    console.log(chalk.red('getRepos error'), e)
  }
  return result
}

// 获取指定tag https://api.github.com/repos/${user}/${repo}/tags

export async function getTags(repo) {
  let result = []
  try {
    const config = await getAll()
    const res = await axios.request({
      url: `https://api.github.com/repos/${config.owner}/${repo}/tags`,
      method: 'GET'
    })
    result = res.data.map((item) => {
      return item.name
    })
  } catch(e) {
    console.log(chalk.red('getRepos error'), e)
  }
  return result
}

