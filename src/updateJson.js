import jsonfile from 'jsonfile'

export const getFile = (packageFile = './package.json') => jsonfile.readFileSync(packageFile)

export default (field, packageFile = './package.json') => {
  let packaged = getFile()
  const newPackaged = { ...packaged, ...field }
  jsonfile.writeFileSync(packageFile, newPackaged, { spaces: 2 })
}
