import _ from 'lodash'
import executeCommand, { checkCommandsExist } from '~/common/executeCommand'
import addNpmScript from '~/common/addNpmScript'
import { copyFiles } from '~/common/copy'
import prompt from 'prompt-promise'
import { parseFile as parseGradleFile } from 'gradle-to-js/lib/parser'

const apkFolder = 'android/app/build/outputs/apk'
const buildApkCommand = buildType => `(cd android && ./gradlew assemble${buildType})`
const supplyCommand = (buildType, playServiceAccount, applicationId) => {
  return `fastlane supply --apk ${apkFolder}/app-${buildType}.apk --track alpha --json_key ${playServiceAccount} --package_name ${applicationId}.${buildType}`
}

const applicationIdFromBuildGradle = async () => {
  const gradleBuild = await parseGradleFile('./android/app/build.gradle')
  return _.get(gradleBuild, 'android.defaultConfig.applicationId')
}

const deployScript = (buildType, applicationId) => {
  return `${buildApkCommand(_.upperFirst(buildType))} && npm run android:increment && ${supplyCommand(buildType, './android/playServiceAccount.json', applicationId)}`
}

export default async () => {
  checkCommandsExist(['fastlane'])

  const applicationId = await applicationIdFromBuildGradle()
  const serviceAccountFile = await prompt(
    `We're going to setup supply to push Android APKs to play store.
    Follow these instructions to generate the .json file.

    https://github.com/fastlane/fastlane/tree/master/supply#setup

    .json filepath: `,
  )

  copyFiles(serviceAccountFile, './android/playServiceAccount.json')

  executeCommand(buildApkCommand('Staging'))
  executeCommand(buildApkCommand('Release'))

  executeCommand('npm install react-native-version')

  addNpmScript('android:increment', `react-native-version --target android --increment-build`)
  addNpmScript('deploy:android:staging', `npm run android:increment && ${deployScript('staging', applicationId)}`)
  addNpmScript('deploy:android:release', `npm run android:increment && ${deployScript('release', applicationId)}`)

  console.log(
    `Your turn!

    Create an app in google play store: https://play.google.com/apps/publish/

    Go to 'App Releases' on left, hit 'Manage Alpha' and create a release.

    ** You must 'Opt Out' of the google code signing **

    Manually upload the staging apk from this folder: ${apkFolder}



    Run npm run deploy:android:staging to test automatic deployments.

    Repeat the same steps for release`,
  )
}
