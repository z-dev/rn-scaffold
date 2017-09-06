import executeCommand, { checkCommandsExist } from '~/common/executeCommand'
import prompt from 'prompt-promise'
import addNpmScript from '~/common/addNpmScript'

export default async () => {
  console.log('Checking prerequisite installs')
  checkCommandsExist(['fastlane', 'xcode-select'])

  console.log('Please go to https://developer.apple.com/account and access Certificates, Identifiers & Profiles')
  console.log('Under Identifiers add a new App IDs add you app, your Bundle Identifier can be found in xcode')
  console.log('Add a IOS device to the Devices tab in Certificates, Identifiers & Profiles, you device UUID can be found in xcode under window > devices when it is plugged in')

  const response = await prompt('Have you completed the previously logged steps? (y/n)')

  if (response !== 'y') {
    process.exit(1)
  }

  executeCommand(`fastlane match init`)

  console.log('Creating development certificates')

  executeCommand('fastlane match development')

  console.log('Createing AppStore certificates')

  executeCommand('fastlane match appstore')

  addNpmScript('apple:sync', 'fastlane match development --readonly && fastlane match appstore --readonly')
}
