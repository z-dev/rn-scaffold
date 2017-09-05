import { replaceInFile } from '~/common/replace'
import { copyFiles } from '~/common/copy'
import addNpmScript from '~/common/addNpmScript'
import { findReactNativeProjectName } from '~/reactNativeConfig/reactNative'
import path from 'path'

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

  console.log('deployment scripts added look for "deploy:ios:staging" and "deploy:ios:release" in package.json')
}
