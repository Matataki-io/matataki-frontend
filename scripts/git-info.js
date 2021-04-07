import { execSync } from 'child_process'
import pkg from '../package.json'

// Ported from https://github.com/NiceLabs/git-rev
// Licensed under MIT

const exec = cmd =>
  execSync(cmd)
    .toString()
    // remove empty line
    .trim()

const hasGit = () => {
  try {
    execSync('git --version')
  } catch {
    return false
  }
  return true
}

const getTopLevel = () => execSync('git rev-parse --show-toplevel')

const isRepository = () => {
  try {
    getTopLevel()
  } catch {
    return false
  }
  return true
}

const getCommitHash = (rev = 'HEAD') => exec(`git rev-parse --short ${rev}`)

const getGitDescribe = () => exec('git describe --always --tags --dirty')

export const getGitInfo = () => {
  const baseInfo = {
    PROJECT_NAME: pkg.name,
    BUILD_DATE: new Date().toISOString(),
    CI: process.env.CI || null
  }
  if (!hasGit() || !isRepository()) {
    console.error('You haven\'t installed git or not a git repository.')
    return baseInfo
  }
  return {
    ...baseInfo,
    COMMIT_HASH: getCommitHash(),
    VERSION: getGitDescribe()
  }
}
