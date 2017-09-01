import executeCommand from '~/common/executeCommand'
import addNpmScript from '~/common/addNpmScript'
import updateJson from '~/common/updateJson'
import replace from 'replace-in-file'

export default () => {
  executeCommand('npm install --save-dev react-native-schemes-manager')

  addNpmScript('postinstall', 'react-native-schemes-manager all && (cd ios && pod install --verbose)')

  updateJson(
    {
      xcodeSchemes: {
        Release: ['Staging'],
        Debug: [],
      },
    },
    './package.json',
  )

  const options = {
    files: './ios/test/AppDelegate.m',
    from: 'initialProperties:nil',
    to: 'initialProperties:{@"environment" : ENVIRONMENT}',
  }

  replace(options)
}
