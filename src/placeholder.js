import jsonfile from 'jsonfile'

export const getFile = (packageFile = './package.json') => jsonfile.readFileSync(packageFile)

export default (test, packageFile = './package.json') => {
  let packaged = getFile()
  const newPackaged = { ...packaged, ...test }
  jsonfile.writeFileSync(packageFile, newPackaged, {spaces: 2})
}
