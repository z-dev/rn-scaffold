import _ from 'lodash'
import yargs from 'yargs'
import { errorIfNotClean, printResetInstructions } from '~/common/git'
import prettierLint from './prettierLint'
import reactNativeInit from './reactNativeInit'
import reactNativeConfig from './reactNativeConfig'
import addIosDeployment from './iosDeployment'
import androidPlaystore from './androidPlaystore'
import setUpProvisioningProfiles from './provisioningProfiles'
import notifications from './notifications'

const firstArg = _.get(yargs.argv, '_[0]')
const run = async () => {
  const isReactNativeInit = firstArg === 'react-native-init'
  try {
    if (!yargs.argv.allowDirtyGit && !isReactNativeInit) {
      errorIfNotClean()
    }
    if (firstArg === 'prettier-lint') {
      prettierLint()
    } else if (isReactNativeInit) {
      await reactNativeInit(yargs.argv)
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
    printResetInstructions()
    process.exit(0)
  } catch (e) {
    console.error(e)

    printResetInstructions()
    process.exit(1)
  }
}

run()
