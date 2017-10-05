import executeCommand, { checkCommandsExist } from '~/common/executeCommand'
import prompt from 'prompt-promise'

export default async argv => {
  console.log('Checking prerequisite installs')
  checkCommandsExist(['react-native', 'react-native-rename'])
  console.log('Initializing React Native codebase')

  const bundleId = await prompt('bundleId (will overwrite any existing bundleId) e.g. com.zdev.myapp): ')
  const appName = await prompt('App Name (e.g. Expresso): ')
  const reactNativeVersion = argv.reactNativeVersion || '0.48.4'

  executeCommand(`react-native init --version react-native@${reactNativeVersion} RNScaffold`)

  executeCommand(`(cd RNScaffold && react-native-rename ${appName} -b ${bundleId})`)
  executeCommand(`mv RNScaffold ${appName}`)
}
