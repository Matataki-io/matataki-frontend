import API from '@/api/API'
import backendAPI from '@/api/backend'
import endpoint from '@/api/endpoint'

export default ({ app }, inject) => {
  inject('API', API)
  inject('backendAPI', backendAPI)
  inject('endpoint', endpoint)
}
