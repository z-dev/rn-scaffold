import { exec } from 'child_process'
import addScript from './addScript'
import updateJson, { getFile } from './updateJson'
import fs from 'fs-extra'
import path from 'path'
export default () => {
  //This asks them a question and waits for their input (there might be a library to help with this!)

  exec('npm install --save-dev prettier eslint eslint-config-airbnb-base eslint-config-prettier  eslint-plugin-import eslint-plugin-prettier husky lint-staged sort-package-json')

  console.log('Adding Prettier Scripts')

  addScript('prettier', 'prettier --single-quote --trailing-comma all --no-semi --print-width 180 --write')

  addScript('format:js', 'npm run prettier -- "{src}/**/*.js"')

  addScript('precommit', 'lint-staged && npm run format:js')

  addScript('lint', 'eslint ./src ./test --ext=js')

  updateJson({
    'lint-staged': {
      '{src,test}/**/*.js': ['npm run format:js --', 'git add'],
      'package.json': ['sort-package-json', 'git add'],
    },
  })

  fs.copySync(path.join(__dirname, 'src/eslint.json'), './.eslintrc')
  console.log('Finished Adding Prettier')
}
