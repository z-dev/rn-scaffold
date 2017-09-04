import _ from 'lodash'
import { execSync } from 'child_process'

export default command => {
  console.log(`\nExecuting: ${command} \n`)
  execSync(command, { stdio: [0, 1, 2] })
}

export const doesCommandExist = command => {
  try {
    execSync(command, { stdio: [] })
  } catch (e) {
    return e.status <= 1
  }
  return true
}

export const checkCommandsExist = commands => {
  const commandsWithErrors = _.reject(commands, doesCommandExist)
  if (!_.isEmpty(commandsWithErrors)) {
    throw new Error(`Could not find prerequisite commands on path: ${commandsWithErrors.join(', ')}`)
  }
}
