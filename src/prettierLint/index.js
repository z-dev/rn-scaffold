import fs from 'fs-extra'
import path from 'path'
import addNpmScript from '~/common/addNpmScript'
import updateJson from '~/common/updateJson'
import executeCommand from '~/common/executeCommand'

export default () => {
  executeCommand('npm install --save-dev prettier babel-eslint eslint-config-prettier eslint-plugin-prettier husky lint-staged sort-package-json')

  executeCommand(`(
    export PKG=eslint-config-airbnb;
    npm info "$PKG@latest" peerDependencies --json | command sed 's/[{},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
  )`)

  addNpmScript('prettier', 'prettier --single-quote --trailing-comma all --no-semi --print-width 180 --write')

  addNpmScript('format:js', 'npm run prettier -- "src/**/*.js"')

  addNpmScript('precommit', 'lint-staged && npm run lint')

  addNpmScript('lint', 'eslint ./src --ext=js')

  updateJson(
    {
      'lint-staged': {
        'src/**/*.js': ['npm run prettier --', 'git add'],
        'package.json': ['sort-package-json', 'git add'],
      },
    },
    './package.json',
  )

  fs.copySync(path.join(__dirname, 'src/prettierLint/.eslintrc'), './.eslintrc')

  console.log('Finished Adding Prettier')
}
