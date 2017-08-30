import { exec } from 'child_process'
import test, { getFile } from './placeholder'

export default (name, command) => {
 try {
    let packaged = getFile()
    test({scripts: { ...packaged.scripts, [name]: command }})
  } catch (e) {
    if (e.message === 'ENOENT, no such file or directory \'package.json\'') {
      throw e
    } else {
      throw e
    }
  }
}
