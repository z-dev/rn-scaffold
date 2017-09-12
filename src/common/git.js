import { checkSync } from 'git-state'

export const isClean = (path = '.') => {
  const checkResult = checkSync(path)
  const changes = checkResult.dirty + checkResult.untracked
  return changes === 0
}

export const errorIfNotClean = (path = '.') => {
  if (!isClean(path)) {
    throw new Error('You have modifications / untracked changes in git. To run scaffold anyway use: --allow-dirty-git')
  }
}

export const printResetInstructions = () => {
  console.log('To rollback these changes in git you can run: git reset --hard && git clean -f -d')
}
