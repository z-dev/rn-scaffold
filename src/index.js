import _ from 'lodash'
import yargs from 'yargs'
import prettierLint from './prettierLint'
import reactNativeConfig from './reactNativeConfig'
import addIosDeployment from './iosDeployment'
import androidPlaystore from './androidPlaystore'
import setUpProvisioningProfiles from './provisioningProfiles'
import notifications from './notifications'

const firstArg = _.get(yargs.argv, '_[0]')

const run = async () => {
  try {
    if (firstArg === 'prettier-lint') {
      prettierLint()
    } else if (firstArg === 'react-native-config') {
      await reactNativeConfig()
    } else if (firstArg === 'ios-deployment') {
      await addIosDeployment()
    } else if (firstArg === 'android-deployment') {
      await androidPlaystore()
    } else if (firstArg === 'provisioning-profiles') {
      await setUpProvisioningProfiles()
    } else if (firstArg === 'notifications') {
      await notifications()
    } else {
      console.error(`Could not find scaffold: ${firstArg}`)
      process.exit(1)
    }
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

run()
