import { replaceInFile } from '~/common/replace'
import executeCommand from '~/common/executeCommand'
import addNpmScript from '~/common/addNpmScript'
import updateJson from '~/common/updateJson'
import prompt from 'prompt-promise'

import { findReactNativeProjectName, projectFileFromProjectName } from './reactNative'

import { appNamePerEnvironment, iconsPerEnvironment, addPreProcessorEnvironments, bundleIdPerEnvironment, copyBuildConfiguration } from './xcodeProject'

export default async () => {
  console.log('Adding React Native Config')

  const bundleId = await prompt('bundleId (e.g. com.zdev.something): ')
  const appName = await prompt('App Name (e.g. Expresso): ')

  const xcodeProjectName = findReactNativeProjectName()

  const projectFile = projectFileFromProjectName(xcodeProjectName)

  copyBuildConfiguration(projectFile, 'Release', 'Staging')

  addPreProcessorEnvironments(projectFile)

  bundleIdPerEnvironment(xcodeProjectName, bundleId)

  appNamePerEnvironment(xcodeProjectName, appName)

  iconsPerEnvironment(xcodeProjectName)

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
