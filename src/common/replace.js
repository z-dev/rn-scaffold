import replace from 'replace-in-file'

export const replaceInFile = (file, toReplace, newString) => {
  console.log(`\nReplacing ${newString} after ${toReplace} in: ${file}`)
  const options = {
    files: file,
    from: toReplace,
    to: newString,
  }
  replace.sync(options)
}

export const addInFileAfter = (file, toReplace, newString) => {
  console.log(`\nAdding ${newString} after ${toReplace} in: ${file}`)

  const options = {
    files: file,
    from: toReplace,
    to: `${toReplace} ${newString}`,
  }
  replace.sync(options)
}

export const addInFileBefore = (file, toReplace, newString) => {
  console.log(`\nAdding ${newString} before ${toReplace} in: ${file}`)

  const options = {
    files: file,
    from: toReplace,
    to: `${newString}${toReplace}`,
  }
  replace.sync(options)
}
