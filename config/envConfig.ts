type EnvType = 'dev' | 'test' | 'prod'

// 所有环境的配置集合
const envConfig = {
  dev: {
    baseURL: '/api',
    proxyURL: 'http://localhost:3000/api',
    timeout: 10000,
    ossDomain: 'https://dev-oss.example.com'
  },
  test: {
    baseURL: 'https://test-api.example.com',
    timeout: 15000,
    ossDomain: 'https://test-oss.example.com'
  },
  prod: {
    baseURL: 'https://prod-api.example.com',
    timeout: 20000,
    ossDomain: 'https://prod-oss.example.com'
  }
}

const currentEnv = (process.env.REACT_APP_ENV || 'dev') as EnvType

export default envConfig[currentEnv]
