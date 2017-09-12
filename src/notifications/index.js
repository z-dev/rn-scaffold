import executeCommand from '~/common/executeCommand'
import prompt from 'prompt-promise'
import { replaceInFile, addInFileAfter } from '~/common/replace'
import { findReactNativeProjectName } from '~/reactNativeConfig/reactNative'

export default async () => {
  executeCommand('npm install react-native-fcm --save')
  executeCommand('react-native link')

  const appId = await prompt('Please enter your bundleId without the config suffix e.g. "com.zdev.myApp" not "com.zdev.myApp.debug": ')
  const userName = await prompt('Please enter you AppleID username: ')

  const projectName = findReactNativeProjectName()

  executeCommand(`fastlane pem -a ${appId}.debug -u ${userName} --force `)
  executeCommand(`fastlane pem -a ${appId}.staging -u ${userName} --force`)
  executeCommand(`fastlane pem -a ${appId}.release -u ${userName} --force`)

  console.log('You will need to rebuild your provisioning profiles on https://developer.apple.com/account/ios/profile/ Simply click on the profiles and select edit -> generate')
  console.log('you will then need to run the apple sync command to sync your new profiles with the ones on your local machine')
  const response = await prompt('Have you completed the previously logged steps? (y/n)')
  if (response !== 'y') {
    executeCommand('git reset --hard && git clean -f -d')
    console.log('all changes reset please try agian')
    process.exit(1)
  }
  addInFileAfter(
    './ios/Podfile',
    `# Pods for ${projectName}`,
    `\n
    pod 'FirebaseMessaging'`,
  )

  executeCommand('cd ios && pod install')

  // prettier-ignore
  replaceInFile(
    `./ios/${projectName}/AppDelegate.h`,
    `@interface AppDelegate : UIResponder <UIApplicationDelegate>`,
    '@import UserNotifications;' +
    '\n' +
    '@interface AppDelegate : UIResponder <UIApplicationDelegate,UNUserNotificationCenterDelegate>'
  )

  // prettier-ignore
  addInFileAfter(
    `./ios/${projectName}/AppDelegate.m`,
    '#import "AppDelegate.h"',
    '\n' +
    '#import "RNFIRMessaging.h"'
  )

  // prettier-ignore
  addInFileAfter(
    `./ios/${projectName}/AppDelegate.m`,
    '[self.window makeKeyAndVisible];',
    '\n[FIRApp configure];\n' +
    '[[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];'

  )

  replaceInFile(
    `./ios/${projectName}/AppDelegate.m`,
    '@end',
    `- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}

@end`,
  )

  console.log(`Now inside xcode you need to enable
    Push Notifications &
    Background Modes > Remote notifications.
    These can be found in your projects Capabilities tab`)

  await prompt('Have you completed the previously logged steps? (y/n)')

  addInFileAfter('./android/build.gradle', "classpath 'com.android.tools.build:gradle:2.2.3'", "\nclasspath 'com.google.gms:google-services:3.0.0'")

  addInFileAfter('./android/app/build.gradle', 'apply plugin: "com.android.application"', "\napply plugin: 'com.google.gms.google-services'")

  addInFileAfter(
    './android/app/src/main/AndroidManifest.xml',
    'android:theme="@style/AppTheme">',
    `\n<service android:name="com.evollu.react.fcm.MessagingService" android:enabled="true" android:exported="true">
    <intent-filter>
      <action android:name="com.google.firebase.MESSAGING_EVENT"/>
    </intent-filter>
  </service>

  <service android:name="com.evollu.react.fcm.InstanceIdService" android:exported="false">
    <intent-filter>
      <action android:name="com.google.firebase.INSTANCE_ID_EVENT"/>
    </intent-filter>
  </service>`,
  )

  addInFileAfter('./android/app/build.gradle', 'dependencies {', "\ncompile 'com.google.firebase:firebase-core:10.0.1'")

  addInFileAfter('./android/app/src/main/AndroidManifest.xml', 'android:windowSoftInputMode="adjustResize"', '\nandroid:launchMode="singleTop"')

  addInFileAfter(
    './android/app/src/main/AndroidManifest.xml',
    '</intent-filter>',
    `\n<intent-filter>
  <action android:name="fcm.ACTION.HELLO" />
  <category android:name="android.intent.category.DEFAULT" />
</intent-filter>`,
  )

  console.log(`Now you need to create a firebase project for each app environment: debug, staging and release. Then add your app for both ios and android for each project.`)
  console.log(
    `You will need to download 3 GoogleService-Info.plist files, each one should be renamed to include -Debug, -Staging and -Release according to the build environment it represents`,
  )
  console.log(`place these files in your projects ios/your_app (inside xcode & in you porjects folder hierarchy) where your current info.plist file is found`)
  console.log(`For android you will need to create 3 folders debug, staging and release under android/app/src and drag the corresponding google-service.json file into it`)
  console.log(`now follow the steps found here under usage https://github.com/evollu/react-native-fcm to start sending notifications`)
  console.log(`If you would like to undo the changes made by this command just run this command: git reset --hard && git clean -f -d`)
}
