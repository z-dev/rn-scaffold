import _ from 'lodash'
import yargs from 'yargs'
import prettierLint from './prettierLint'
import reactNativeConfig from './reactNativeConfig'

const firstArg = _.get(yargs.argv, '_[0]')

if (firstArg === 'prettier-lint') {
  console.log('Adding Prettier')
  prettierLint()
} else if (firstArg === 'react-native-config') {
  reactNativeConfig()
}
