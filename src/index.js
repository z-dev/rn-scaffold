import _ from 'lodash'
import yargs from 'yargs'
import prettierLint from './prettierLint'
import reactNativeConfig from './reactNativeConfig'
import addIosDeployment from './iosDeployment'
import androidPlaystore from './androidPlaystore'
import setUpProvisioningProfiles from './provisioningProfiles'
import notifications from './notifications'

const firstArg = _.get(yargs.argv, '_[0]')

if (firstArg === 'prettier-lint') {
  console.log('Adding Prettier')
  prettierLint()
} else if (firstArg === 'react-native-config') {
  reactNativeConfig()
} else if (firstArg === 'ios-deployment') {
  addIosDeployment()
} else if (firstArg === 'android-deployment') {
  androidPlaystore()
} else if (firstArg === 'provisioning-profiles') {
  setUpProvisioningProfiles()
} else if (firstArg === 'test') {
  notifications()
}
