import fs from 'fs'
import _ from 'lodash'

const XCODE_PROJECT_SUFFIX = '.xcodeproj'

export const findReactNativeXcodeProjectName = () => {
  const files = fs.readdirSync('./ios')
  const xcodeProjectFile = _.find(files, f => f.endsWith(XCODE_PROJECT_SUFFIX))
  return xcodeProjectFile.replace(XCODE_PROJECT_SUFFIX, '')
}

export const projectFileFromProjectName = xcodeProjectName => `ios/${xcodeProjectName}.xcodeproj/project.pbxproj`
