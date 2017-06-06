/* eslint-disable*/
import _ from 'lodash'
import defaults from './defaults'
import productionConfig from './production'
import developmentConfig from './development'

const environment = process.env.NODE_ENV

const getEnvironment = () => {
  switch (environment) {
    case 'production':
      return productionConfig
    case 'development':
      return developmentConfig
    default:
      return developmentConfig
  }
}

const config = _.merge(defaults, getEnvironment())
export default config
