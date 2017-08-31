import jsonfile from 'jsonfile'
import stringify from 'json-stringify-pretty-compact'

export const getFile = (packageFile = './package.json') => jsonfile.readFileSync(packageFile)

export default (toMergeIn, packageFile = './package.json', print = true) => {
  if (print) {
    console.log(`\n adding ${stringify(toMergeIn)} to ${packageFile}\n`)
  }
  const packaged = getFile()
  const newPackaged = { ...packaged, ...toMergeIn }
  jsonfile.writeFileSync(packageFile, newPackaged, { spaces: 2 })
}
