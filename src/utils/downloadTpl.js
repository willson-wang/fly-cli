import download from 'download-git-repo'

export default async function downloadTpl(url, options, projectName) {
  return new Promise((resolve, reject) => {
    // 统一采用短写法即：github:github.com:owner/name#master
    download(url, projectName, options, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}