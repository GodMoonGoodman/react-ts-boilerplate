const appIndex = path.resolve(__dirname, 'src', 'index.tsx')

const appBuild = path.resolve(__dirname, 'build')

module.exports = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  return {
    mode: webpackEnv,
    entry: appIndex,
    output: {
      path: appBuild,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
    },
  }
}
