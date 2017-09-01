import replace from 'replace-in-file'

export const replaceInFile = options => {
  console.log(`\nReplacing ${options.from} with: ${options.to} in files: ${options.files}`)
  replace(options)
}
