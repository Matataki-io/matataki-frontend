import axios from 'axios'

const uploadToSmDotMs = imgfile => {
  const formdata = new FormData()
  formdata.append('smfile', imgfile)
  return axios({
    url: 'https://sm.ms/api/upload',
    method: 'post',
    data: formdata,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// For using default uploader only
const currentImagesUploader = uploadToSmDotMs

export { uploadToSmDotMs }
export default currentImagesUploader
