import API from '@/api/API'
import backendAPI from '@/api/backend'

export default ({ app }, inject) => {
  inject('API', API)
  inject('backendAPI', backendAPI)
}
