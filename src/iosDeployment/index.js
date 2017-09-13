import { replaceInFile } from '~/common/replace'
import { copyFiles } from '~/common/copy'
import addNpmScript from '~/common/addNpmScript'
import { findReactNativeProjectName } from '~/reactNativeConfig/reactNative'
import path from 'path'
import executeCommand from '~/common/executeCommand'

export default async () => {
  console.log('Adding npm deployment scripts')

  addNpmScript('deploy:ios:staging', 'CONFIGURATION=Staging bin/pushToITunes.sh')
  addNpmScript('deploy:ios:release', 'CONFIGURATION=Release bin/pushToITunes.sh')
  addNpmScript('ios:increment', `react-native-version --target ios --increment-build`)

  const xcodeProjectName = findReactNativeProjectName()

  console.log('Building ios deployment script')

  copyFiles(path.join(__dirname, 'src/iosDeployment/pushToITunes.sh'), `./bin/pushToITunes.sh`)

  replaceInFile('./bin/pushToITunes.sh', 'WORKSPACE_FILE="ios/.xcworkspace/"', `WORKSPACE_FILE="ios/${xcodeProjectName}.xcworkspace/"`)
  replaceInFile('./bin/pushToITunes.sh', 'SCHEME=""', `SCHEME="${xcodeProjectName}"`)

  executeCommand('chmod u+x ./bin/pushToITunes.sh')

  console.log('installing cocoa pods')
  executeCommand('cd ios && pod init')

  replaceInFile('./ios/Podfile', "# platform :ios, '9.0'", "platform :ios, '9.0'")

  // prettier-ignore
  replaceInFile(
    './ios/Podfile',
    '# Uncomment the next line to define a global platform for your project',
    `project '${xcodeProjectName}.xcodeproj/'` +
    '\n' +
    '\n' +
    '# Uncomment the next line to define a global platform for your project'
  )
  // pod init is creating 2 instances of the tvOS pod commands so one of them is getting removed here
  replaceInFile(
    './ios/Podfile',
    `target '${xcodeProjectName}-tvOS' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # Pods for ${xcodeProjectName}-tvOS

  target '${xcodeProjectName}-tvOSTests' do
    inherit! :search_paths
    # Pods for testing
  end

end`,
    '',
  )

  executeCommand('cd ios && pod install')

  console.log("Go to https://itunesconnect.apple.com go to 'My Apps' and add your apps (with the correct bundle id).")
  await prompt('Have you completed the previous steps? (y/n)')

  console.log('deployment scripts added look for "deploy:ios:staging" and "deploy:ios:release" in package.json')
}
