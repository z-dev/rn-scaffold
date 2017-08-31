import { exec } from 'child_process'
import updateJson, { getFile } from './updateJson'

export default (name, command) => {
 try {
    let packaged = getFile()
    updateJson({scripts: { ...packaged.scripts, [name]: command }})
  } catch (e) {
    if (e.message === 'ENOENT, no such file or directory \'package.json\'') {
      throw e
    } else {
      throw e
    }
  }
}
