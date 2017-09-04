import fs from 'fs-extra'

export const copyFiles = (fromPath, toPath) => {
  console.log(`Copying from: ${fromPath} to: ${toPath}`)
  fs.copySync(fromPath, toPath)
}
