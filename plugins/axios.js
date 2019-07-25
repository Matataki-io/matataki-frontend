export default function ({ $axios, redirect }, inject) {
  $axios.defaults.baseURL = process.env.VUE_APP_API
  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })
  $axios.onResponse((res) => {
    return res
  })
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
