const printBuildInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    // We do not need to print the obvious information
    // in the development environment.
    return
  }
  console.group('Build info')
  console.log('Project:', process.env.PROJECT_NAME)
  console.log(
    'Build date:',
    process.env.BUILD_DATE
      ? new Date(process.env.BUILD_DATE).toLocaleString()
      : 'Unknown'
  )
  console.log(
    'Environment:',
    `${process.env.NODE_ENV}${process.env.CI ? '(ci)' : ''}`
  )
  console.log('Version:', process.env.VERSION)
  console.log(
    'View on GitHub:',
    `https://github.com/Matataki-io/Matataki-FE/tree/${process.env.COMMIT_HASH}`
  )
  console.groupEnd()
}

export default function() {
  printBuildInfo()
}
