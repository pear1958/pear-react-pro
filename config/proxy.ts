import envConfig from './envConfig'

const { baseURL, proxyURL } = envConfig as Recordable

export default {
  dev: {
    [baseURL]: {
      target: proxyURL,
      // 配置了这个可以从 http 代理到 https
      changeOrigin: true,
      pathRewrite: (path: string) => path.replace(baseURL, '')
    }
  },
  test: {
    '/api': {
      target: 'https://proapi.azurewebsites.net',
      pathRewrite: { '^/api': '' }
    }
  },
  pre: {
    '/api': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
}
