import { exec } from 'child_process'

export default (name, command) => {
  exec(`npmAddScript -k ${name} -v ${command}`)
}
