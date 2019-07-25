import API from '@/api/API'
import backendAPI from '@/api/backend'
import endpoint from '@/api/endpoint'
import utils from '@/utils/utils'

export default ({ app }, inject) => {
  inject('API', API)
  inject('backendAPI', backendAPI)
  inject('endpoint', endpoint)
  inject('utils', utils)
}
