import point from '../config/points.js'
import userStatus from '../config/userStatus.js'
import API from '@/request/API'
import backendAPI from '@/request/backend'
import endpoint from '@/request/endpoint'
import utils from '@/utils/utils'
import publishMethods from '@/utils/publish_methods'
import ossProcess from '@/utils/oss_process'

// eslint-disable-next-line no-unused-vars
export default ({ app }, inject) => {
  inject('API', API)
  inject('backendAPI', backendAPI)
  inject('endpoint', endpoint)
  inject('utils', utils)
  inject('publishMethods', publishMethods)
  inject('point', point)
  inject('userStatus', userStatus)
  inject('ossProcess', ossProcess)
}
