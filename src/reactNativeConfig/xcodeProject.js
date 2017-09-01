import xcode from 'xcode'
import _ from 'lodash'
import fs from 'fs'

export const copyBuildConfiguration = (projectPath, existingBuildConfigName, newBuildConfigurationName) => {
  const xcodeProject = xcode.project(projectPath).parseSync()

  const buildConfigurationsToCopy = _.pickBy(xcodeProject.pbxXCBuildConfigurationSection(), buildConfiguration => buildConfiguration.name === existingBuildConfigName)

  _.forEach(buildConfigurationsToCopy, (buildConfigurationToCopy, key) => {
    const newBuildConfigUuid = xcodeProject.generateUuid()
    xcodeProject.pbxXCBuildConfigurationSection()[newBuildConfigUuid] = _.cloneDeep(buildConfigurationToCopy)
    xcodeProject.pbxXCBuildConfigurationSection()[newBuildConfigUuid].name = newBuildConfigurationName
    xcodeProject.pbxXCBuildConfigurationSection()[`${newBuildConfigUuid}_comment`] = newBuildConfigurationName

    const xcConfigListKey = _.findKey(xcodeProject.pbxXCConfigurationList(), xcConfigList => _.includes(_.map(xcConfigList.buildConfigurations, 'value'), key))

    xcodeProject.pbxXCConfigurationList()[xcConfigListKey].buildConfigurations.push({ value: newBuildConfigUuid, comment: newBuildConfigurationName })
  })

  fs.writeFileSync(projectPath, xcodeProject.writeSync())
}
