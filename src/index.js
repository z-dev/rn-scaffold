import _ from 'lodash'
import yargs from 'yargs'
import addPrettier from './addPrettier'
console.log(yargs.argv)
const firstArg = _.get(yargs.argv, '_[0]')

if (firstArg === 'prettier-lint') {
  console.log('Adding Prettier')
  addPrettier()
}
