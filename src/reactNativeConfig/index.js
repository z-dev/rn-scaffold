import { replaceInFile, addInFileAfter } from '~/common/replace'
import executeCommand, { checkCommandsExist } from '~/common/executeCommand'
import addNpmScript from '~/common/addNpmScript'
import updateJson from '~/common/updateJson'
import prompt from 'prompt-promise'
import { copyFiles } from '~/common/copy'
import path from 'path'
import indentString from 'indent-string'

import { findReactNativeProjectName, projectFileFromProjectName } from './reactNative'

import { appNamePerEnvironment, iconsPerEnvironment, addPreProcessorEnvironments, bundleIdPerEnvironment, copyBuildConfiguration } from './xcodeProject'
import { applicationIdSuffixPerEnvironment, appNameSuffixPerEnvironment, setupApkSigning } from './android'

/* eslint-disable no-useless-concat, no-useless-escape */

export default async () => {
  console.log('Checking prerequisite installs')
  checkCommandsExist(['npm', 'keytool', 'fastlane'])
  console.log('Adding React Native Config')

  const bundleId = await prompt('bundleId (will overwrite any existing bundleId) e.g. com.zdev.something): ')
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

  replaceInFile(`./ios/${xcodeProjectName}/AppDelegate.m`, 'initialProperties:nil', 'initialProperties:@{@"environment" : ENVIRONMENT}')

  // prettier-ignore
  addInFileAfter(
    './android/app/build.gradle',
    'import com.android.build.OutputFile',
    '\n\n' +
    'project.ext.react = [' +
    '  bundleInStaging: true,\n' +
    '  bundleInRelease: true\n' +
    ']\n',
  )

  addInFileAfter(
    './android/app/build.gradle',
    `proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }`,
    `\n        staging {
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }`,
  )

  addInFileAfter(
    `./android/app/src/main/java/com/${xcodeProjectName}/MainActivity.java`,
    `return "${xcodeProjectName}";
    }`,
    `\n    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
          @Nullable
            @Override
            protected Bundle getLaunchOptions() {
                Bundle initialProps = new Bundle();
                initialProps.putString("environment", BuildConfig.BUILD_TYPE);
                return initialProps;
            }
        };
    }`,
  )

  // prettier-ignore
  addInFileAfter(
    `./android/app/src/main/java/com/${xcodeProjectName}/MainActivity.java`,
    `import com.facebook.react.ReactActivity;`,
    '\n' +
    'import com.facebook.react.ReactActivityDelegate;\n' +
    'import android.os.Bundle;\n' +
    'import android.support.annotation.Nullable;\n'
  )

  // prettier-ignore
  replaceInFile(
    './android/app/build.gradle',
    /applicationId \".*\"/,
    `applicationId "${bundleId}"`,
  )

  // prettier-ignore
  addInFileAfter(
    './android/app/build.gradle',
    'buildTypes {',
    indentString(
      '\n' +
      'debug {\n' +
      '}',
      8
    )
  )

  applicationIdSuffixPerEnvironment()
  appNameSuffixPerEnvironment(appName)

  copyFiles(path.join(__dirname, 'src/reactNativeConfig/androidAppIcons'), `./android/app/src/`)

  setupApkSigning(bundleId)
}
