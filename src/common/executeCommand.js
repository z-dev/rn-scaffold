import { execSync } from 'child_process'

export default command => {
  console.log(`\nExecuting: ${command} \n`)
  execSync(command, { stdio: [0, 1, 2] })
}
