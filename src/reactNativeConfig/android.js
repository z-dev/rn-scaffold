import { addInFileAfter, replaceInFile } from '~/common/replace'

/* eslint-disable no-useless-escape */
const setAppNameForBuildType = (appName, buildType) => {
  addInFileAfter('./android/app/build.gradle', `${buildType} {`, `resValue "string", "app_name", "${appName}"\n`)
}

const addApplicationIdSuffixForBuildType = buildType => {
  addInFileAfter('./android/app/build.gradle', `${buildType} {`, `\napplicationIdSuffix ".${buildType}"\n`)
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
