import updateJson, { getFile } from './updateJson'

export default (name, command) => {
  try {
    const packaged = getFile()
    updateJson({ scripts: { ...packaged.scripts, [name]: command } })
  } catch (e) {
    if (e.message === "ENOENT, no such file or directory 'package.json'") {
      throw e
    } else {
      throw e
    }
  }
}
