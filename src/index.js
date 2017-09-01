import _ from 'lodash'
import yargs from 'yargs'
import prettierLint from './prettierLint'
import schemesManager from './schemesManager'

const firstArg = _.get(yargs.argv, '_[0]')

if (firstArg === 'prettier-lint') {
  console.log('Adding Prettier')
  prettierLint()
} else if (firstArg === 'schemes-manager') {
  console.log('Adding Schemes Manager')
  schemesManager()
}
