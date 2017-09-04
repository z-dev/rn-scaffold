import crypto from 'crypto'
import { addInFileAfter, addInFileBefore, replaceInFile } from '~/common/replace'
import executeCommand from '~/common/executeCommand'
import fs from 'fs-extra'
import indentString from 'indent-string'

/* eslint-disable no-useless-escape */
const setAppNameForBuildType = (appName, buildType) => {
  addInFileAfter('./android/app/build.gradle', `${buildType} {`, indentString(`\nresValue "string", "app_name", "${appName}"`, 12))
}

const addApplicationIdSuffixForBuildType = buildType => {
  addInFileAfter('./android/app/build.gradle', `${buildType} {`, indentString(`\napplicationIdSuffix ".${buildType}"`, 12))
}

export const applicationIdSuffixPerEnvironment = () => {
  addApplicationIdSuffixForBuildType('debug')
  addApplicationIdSuffixForBuildType('staging')
  addApplicationIdSuffixForBuildType('release')
}

export const appNameSuffixPerEnvironment = appName => {
  replaceInFile('./android/app/src/main/res/values/strings.xml', /<string name=\"app_name\">.+<\/string>/, '')

  setAppNameForBuildType(`${appName} Debug`, 'debug')
  setAppNameForBuildType(`${appName} Staging`, 'staging')
  setAppNameForBuildType(appName, 'release')
}

const generateKeystore = (gradleFile, appId, buildType) => {
  const storePassword = crypto.randomBytes(64).toString('base64')
  const keyPassword = crypto.randomBytes(64).toString('base64')
  const keyStoreFile = `keyStores/${buildType}.keystore`

  executeCommand(
    `keytool -genkey -v -keystore ./android/app/${keyStoreFile} -alias ${buildType} -keyalg RSA -keysize 2048 -validity 10000 -storepass ${storePassword} -keypass ${keyPassword} -dname "CN=${appId}, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown"`,
  )

  addInFileAfter(gradleFile, `${buildType} {`, indentString(`\nsigningConfig signingConfigs.${buildType}`, 12))

  // prettier-ignore
  addInFileAfter(
    gradleFile,
    'signingConfigs {',
    indentString(
      '\n' +
      `${buildType} {\n` +
      `  storeFile file("./${keyStoreFile}")\n` +
      `  storePassword "${storePassword}"\n` +
      `  keyAlias "${buildType}"\n` +
      `  keyPassword "${keyPassword}"\n` +
      '}\n',
      8
    )
  )
}

export const setupApkSigning = (appId, gradleFile = './android/app/build.gradle') => {
  // prettier-ignore
  addInFileBefore(
    './android/app/build.gradle',
    indentString('buildTypes {', 4),
    indentString(
      '\n'+
      'signingConfigs {\n' +
      '}\n',
      4
    )
  )

  fs.mkdirp('./android/app/keyStores')
  generateKeystore(gradleFile, appId, 'debug')
  generateKeystore(gradleFile, appId, 'staging')
  generateKeystore(gradleFile, appId, 'release')

  // We want to commit the keystores to git.
  replaceInFile('./.gitignore', '*.keystore', '')
}
