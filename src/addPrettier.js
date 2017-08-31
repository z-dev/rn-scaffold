import { exec } from 'child_process'
import addScript from './addScript'
import updateJson, { getFile } from './updateJson'
import fs from 'fs-extra'

export default () => {

  //This asks them a question and waits for their input (there might be a library to help with this!)

  exec('npm install --save-dev prettier eslint eslint-config-airbnb-base eslint-config-prettier  eslint-plugin-import eslint-plugin-prettier')

  console.log('Adding Prettier Scripts')

  addScript('prettier', "prettier --single-quote --trailing-comma all --no-semi --print-width 180 --write")

  addScript('format:js', "npm run prettier -- \"{src}/**/*.js\"")

  addScript('precommit', "lint-staged && npm run format:js")

  updateJson({'lint-staged': {
    "{components,pages,styles}/**/*.js": [
      "npm run prettier -- ",
      "git add"
    ]
  }})

  fs.copySync('./src/eslint.json', './.eslintrc')
  console.log('Finished Adding Prettier')
}

