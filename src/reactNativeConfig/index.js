import { replaceInFile } from '~/common/replace'
import executeCommand from '~/common/executeCommand'
import addNpmScript from '~/common/addNpmScript'
import updateJson from '~/common/updateJson'
import { findReactNativeXcodeProjectName } from './reactNative'

import { addPreProcessorEnvironments, copyBuildConfiguration } from './xcodeProject'

export default () => {
  console.log('Adding React Native Config')

  const xcodeProjectName = findReactNativeXcodeProjectName()

  copyBuildConfiguration(`ios/${xcodeProjectName}.xcodeproj/project.pbxproj`, 'Release', 'Staging')

  addPreProcessorEnvironments(`ios/${xcodeProjectName}.xcodeproj/project.pbxproj`)

  executeCommand('npm install --save-dev react-native-schemes-manager')

  addNpmScript('postinstall', 'react-native-schemes-manager all')

  updateJson(
    {
      xcodeSchemes: {
        Release: ['Staging'],
        Debug: [],
      },
    },
    './package.json',
  )

  // package-lock.json had to be removed to make this work.
  executeCommand('rm package-lock.json && npm install')

  replaceInFile({
    files: `./ios/${xcodeProjectName}/AppDelegate.m`,
    from: 'initialProperties:nil',
    to: 'initialProperties:@{@"environment" : ENVIRONMENT}',
  })
}
