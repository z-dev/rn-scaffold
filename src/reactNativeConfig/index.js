import { replaceInFile } from '~/common/replace'
import executeCommand from '~/common/executeCommand'
import addNpmScript from '~/common/addNpmScript'
import updateJson from '~/common/updateJson'
import { findReactNativeXcodeProjectName } from './reactNative'

import { addPreProcessorEnvironments, bundleIdPerEnvironment, copyBuildConfiguration } from './xcodeProject'

export default () => {
  console.log('Adding React Native Config')

  const xcodeProjectName = findReactNativeXcodeProjectName()

  const projectFile = `ios/${xcodeProjectName}.xcodeproj/project.pbxproj`

  copyBuildConfiguration(projectFile, 'Release', 'Staging')

  addPreProcessorEnvironments(projectFile)

  bundleIdPerEnvironment(projectFile, 'com.zdev.project')

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
