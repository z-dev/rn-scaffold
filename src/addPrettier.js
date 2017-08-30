console.log('Adding Prettier')

//This asks them a question and waits for their input (there might be a library to help with this!)

exec('npm install --save-dev prettier eslint eslint-config-airbnb-base eslint-config-prettier  eslint-plugin-import eslint-plugin-prettier')

addScript('prettier', '"prettier --single-quote --trailing-comma all --no-semi --print-width 180 --write"')

addScript('format:js', '"npm run prettier -- \"{src}/**/*.js\""')

const lintStagedConfig = `
  "lint-staged": {
    "{components,pages,styles}/**/*.js": [
      "npm run prettier -- ",
      "git add"
    ]
  }
`

addBeforeLast('package.json', '}', lintStagedConfig)
