import replace from 'replace-in-file'

export const replaceInFile = options => {
  console.log(`\nReplacing ${options.from} with: ${options.to} in files: ${options.files}`)
  replace(options)
}

export const addInFileAfter = (file, toReplace, newString) => {
  console.log(`\n adding ${newString} after ${toReplace} in: ${file}`)
  const string = `${toReplace} ${newString}`

  const options = {
    files: file,
    from: toReplace,
    to: string,
  }
  replace.sync(options)
}
