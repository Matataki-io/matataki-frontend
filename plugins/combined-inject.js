import point from '../config/points.js'
import API from '@/api/API'
import backendAPI from '@/api/backend'
import endpoint from '@/api/endpoint'
import utils from '@/utils/utils'
import publishMethods from '@/utils/publish_methods'

export default ({ app }, inject) => {
  inject('API', API)
  inject('backendAPI', backendAPI)
  inject('endpoint', endpoint)
  inject('utils', utils)
  inject('publishMethods', publishMethods)
  inject('point', point)
}
