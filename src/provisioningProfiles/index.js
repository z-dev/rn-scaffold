import executeCommand from '~/common/executeCommand'
import prompt from 'prompt-promise'

export default async () => {
  console.log('Please go to https://developer.apple.com/account and access Certificates, Identifiers & Profiles')
  console.log('Under Identifiers add a new App IDs add you app, your Bundle Identifier can be found in xcode')
  console.log('Add a IOS device to the Devices tab in Certificates, Identifiers & Profiles, you device UUID can be found in xcode under window > devices when it is plugged in')

  await prompt('Have you completed the previously logged steps?')

  executeCommand(`fastlane match init`)

  console.log('Creating development certificates')

  executeCommand('fastlane match development')

  console.log('Createing AppStore certificates')

  executeCommand('fastlane match appstore')
}
