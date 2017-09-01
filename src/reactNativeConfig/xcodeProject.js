import xcode from 'xcode'
import _ from 'lodash'
import fs from 'fs-extra'
import { arrayWrap } from '~/common/utils'
import plist from 'plist'
import path from 'path'

import { projectFileFromProjectName } from './reactNative'

const xcodeProjectFromFile = projectPath => xcode.project(projectPath).parseSync()

const saveXcodeProject = (projectPath, xcodeProject) => fs.writeFileSync(projectPath, xcodeProject.writeSync())

const updateInfoPlist = (infoPlistFile, key, value) => {
  const data = plist.parse(fs.readFileSync(infoPlistFile, 'utf8'))
  fs.writeFileSync(infoPlistFile, plist.build({ ...data, [key]: value }))
}

const getBuildConfigurations = projectPath => {
  const xcodeProject = xcodeProjectFromFile(projectPath)
  return _.chain(xcodeProject.pbxXCBuildConfigurationSection())
    .map(buildConfiguration => buildConfiguration.name)
    .uniq()
    .compact()
    .value()
}

const findBuildConfigs = (xcodeProject, buildConfiguration) => _.filter(xcodeProject.pbxXCBuildConfigurationSection(), config => config.name === buildConfiguration)

const findProjectBuildConfig = (xcodeProject, buildConfiguration) =>
  _.find(findBuildConfigs(xcodeProject, buildConfiguration), config => !_.has(config, 'buildSettings.PRODUCT_NAME'))

const findAppBuildConfig = (xcodeProject, buildConfiguration) =>
  _.find(findBuildConfigs(xcodeProject, buildConfiguration), config => {
    const infoPlistFile = _.get(config, 'buildSettings.INFOPLIST_FILE')
    return !_.includes(infoPlistFile, 'tvOS') && !_.includes(infoPlistFile, 'Tests/') && !_.has(config, 'buildSettings.GCC_PREPROCESSOR_DEFINITIONS')
  })

export const appNamePerEnvironment = (projectName, appNamePrefix) => {
  const projectPath = projectFileFromProjectName(projectName)
  console.log(`\nAdding App Name per environment ${projectPath}\n`)

  const xcodeProject = xcodeProjectFromFile(projectPath)
  const buildConfigurations = getBuildConfigurations(projectPath)
  _.forEach(buildConfigurations, buildConfiguration => {
    const projectBuildConfig = findProjectBuildConfig(xcodeProject, buildConfiguration)
    const appNameSuffix = buildConfiguration === 'Release' ? '' : ` ${buildConfiguration}`
    const appName = `${appNamePrefix}${appNameSuffix}`
    console.log(`\nSetting up a App Name for ${buildConfiguration}: ${appName}\n`)
    projectBuildConfig.buildSettings.APP_NAME = `"${appName}"`
  })
  saveXcodeProject(projectPath, xcodeProject)
  updateInfoPlist(`ios/${projectName}/Info.plist`, 'CFBundleDisplayName', '$(APP_NAME)')
}

export const bundleIdPerEnvironment = (projectName, bundleIdPrefix) => {
  const projectPath = projectFileFromProjectName(projectName)
  console.log(`\nSetting up a bundle id per environment ${projectPath}\n`)

  const xcodeProject = xcodeProjectFromFile(projectPath)
  const buildConfigurations = getBuildConfigurations(projectPath)
  _.forEach(buildConfigurations, buildConfiguration => {
    const projectBuildConfig = findProjectBuildConfig(xcodeProject, buildConfiguration)
    const bundleId = `${bundleIdPrefix}.${_.toLower(buildConfiguration)}`
    console.log(`\nSetting up a bundle id for ${buildConfiguration}: ${bundleId}\n`)
    projectBuildConfig.buildSettings.PRODUCT_BUNDLE_IDENTIFIER = bundleId
  })
  saveXcodeProject(projectPath, xcodeProject)
  updateInfoPlist(`ios/${projectName}/Info.plist`, 'CFBundleIdentifier', '$(PRODUCT_BUNDLE_IDENTIFIER)')
}

export const addPreProcessorEnvironments = projectPath => {
  console.log(`\nAdding Preprocessor ENVIRONMENT variables in ${projectPath}\n`)

  const xcodeProject = xcodeProjectFromFile(projectPath)
  const buildConfigurations = getBuildConfigurations(projectPath)
  _.forEach(buildConfigurations, buildConfiguration => {
    const projectBuildConfig = findProjectBuildConfig(xcodeProject, buildConfiguration)
    const environmentDefiniton = `"ENVIRONMENT=\\\\@\\\\\\"${_.toUpper(buildConfiguration)}\\\\\\""`
    const gccPreprocessorDefinitions = [environmentDefiniton, ...arrayWrap(projectBuildConfig.buildSettings.GCC_PREPROCESSOR_DEFINITIONS)]
    projectBuildConfig.buildSettings.GCC_PREPROCESSOR_DEFINITIONS = gccPreprocessorDefinitions
  })
  saveXcodeProject(projectPath, xcodeProject)
}

export const iconsPerEnvironment = projectName => {
  const projectPath = projectFileFromProjectName(projectName)
  console.log(`\nAdding App Icon per environment\n`)
  fs.copySync(path.join(__dirname, 'src/reactNativeConfig/appIcons'), `ios/${projectName}/Images.xcassets/`)
  fs.remove(`ios/${projectName}/Images.xcassets/AppIcon.appiconset`)
  const xcodeProject = xcodeProjectFromFile(projectPath)
  const buildConfigurations = getBuildConfigurations(projectPath)
  _.forEach(buildConfigurations, buildConfiguration => {
    const appBuildConfig = findAppBuildConfig(xcodeProject, buildConfiguration)
    appBuildConfig.buildSettings.ASSETCATALOG_COMPILER_APPICON_NAME = `AppIcon.${buildConfiguration}`
  })
  saveXcodeProject(projectPath, xcodeProject)
}

export const copyBuildConfiguration = (projectPath, existingBuildConfigName, newBuildConfigurationName) => {
  console.log(`\nCopying build configuration: ${existingBuildConfigName} to ${newBuildConfigurationName} in ${projectPath}\n`)
  const xcodeProject = xcodeProjectFromFile(projectPath)

  const buildConfigurationsToCopy = _.pickBy(xcodeProject.pbxXCBuildConfigurationSection(), buildConfiguration => buildConfiguration.name === existingBuildConfigName)

  _.forEach(buildConfigurationsToCopy, (buildConfigurationToCopy, key) => {
    const newBuildConfigUuid = xcodeProject.generateUuid()
    xcodeProject.pbxXCBuildConfigurationSection()[newBuildConfigUuid] = _.cloneDeep(buildConfigurationToCopy)
    xcodeProject.pbxXCBuildConfigurationSection()[newBuildConfigUuid].name = newBuildConfigurationName
    xcodeProject.pbxXCBuildConfigurationSection()[`${newBuildConfigUuid}_comment`] = newBuildConfigurationName

    const xcConfigListKey = _.findKey(xcodeProject.pbxXCConfigurationList(), xcConfigList => _.includes(_.map(xcConfigList.buildConfigurations, 'value'), key))

    xcodeProject.pbxXCConfigurationList()[xcConfigListKey].buildConfigurations.push({ value: newBuildConfigUuid, comment: newBuildConfigurationName })
  })

  saveXcodeProject(projectPath, xcodeProject)
}
