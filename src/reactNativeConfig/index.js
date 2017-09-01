import { replaceInFile, addInFileAfter } from '~/common/replace'
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

  addPreProcessorEnvironments('ios/test.xcodeproj/project.pbxproj')

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

  addInFileAfter(
    './android/app/build.gradle',
    'import com.android.build.OutputFile',
    `\n\nproject.ext.react = [
    bundleInStaging: true,
    bundleInRelease: true
  ]`,
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
}
