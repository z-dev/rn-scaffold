import updateJson, { getFile } from './updateJson'

const DONT_PRINT = false

export default (name, command) => {
  console.log(`\nAdding npm script: "${name}": "${command}" \n`)
  try {
    const packaged = getFile()
    updateJson({ scripts: { ...packaged.scripts, [name]: command } }, './package.json', DONT_PRINT)
  } catch (e) {
    if (e.message === "ENOENT, no such file or directory 'package.json'") {
      throw e
    } else {
      throw e
    }
  }
}
