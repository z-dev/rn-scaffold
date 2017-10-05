import executeCommand, { checkCommandsExist } from '~/common/executeCommand'
import prompt from 'prompt-promise'
import addNpmScript from '~/common/addNpmScript'

export default async () => {
  console.log('Checking prerequisite installs')
  checkCommandsExist(['fastlane', 'xcode-select'])

  const appId = await prompt('Please enter your bundleId without the config suffix e.g. "com.zdev.myApp" not "com.zdev.myApp.debug": ')
  const userName = await prompt('Please enter you AppleID username: ')

  console.log('Please go to https://developer.apple.com/account and access Certificates, Identifiers & Profiles')
  console.log(`Under Identifiers > App IDs. Add new App IDs for ${appId}.debug, ${appId}.staging and ${appId}`)
  console.log('Add a IOS device to the Devices tab in Certificates, Identifiers & Profiles, you device UUID can be found in xcode under window > devices when it is plugged in')

  const response = await prompt('Have you completed the previously logged steps? (y/n)')

  if (response !== 'y') {
    process.exit(1)
  }

  executeCommand(`fastlane match init`)

  console.log('Creating development certificates')

  executeCommand(`fastlane match development -a ${appId}.debug -u ${userName}`)
  executeCommand(`fastlane match development -a ${appId}.staging -u ${userName}`)
  executeCommand(`fastlane match development -a ${appId} -u ${userName}`)

  console.log('Creating AppStore certificates')

  executeCommand(`fastlane match appstore -a ${appId}.staging -u ${userName}`)
  executeCommand(`fastlane match appstore -a ${appId} -u ${userName}`)

  addNpmScript('apple:sync', 'fastlane match development --readonly && fastlane match appstore --readonly')
  console.log('Other team members need to run `npm run apple:sync` after they check-out the project.')
  console.log(
    'Open xcode, go to project settings -> general -> untick Automatically manage signing -> select the match provisioning profiles for each build environment \n\n For debug: select match Development. \n For Staging & Release: select match AppStore',
  )
  await prompt('Have you completed the previous steps? (y/n)')
}
