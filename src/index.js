import { exec } from 'child_process'


console.log('Adding Prettier')

//This asks them a question and waits for their input (there might be a library to help with this!)

exec('npm install --save-dev prettier eslint eslint-config-airbnb-base eslint-config-prettier  eslint-plugin-import eslint-plugin-prettier')
