import executeCommand from '~/common/executeCommand'

export default async () => {
  executeCommand(`fastlane match init`)

  console.log('Creating development certificates')

  executeCommand('fastlane match development')

  console.log('Createing AppStore certificates')

  executeCommand('fastlane match appstore')
}
