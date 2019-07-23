import axios from 'axios'
import qs from 'qs'
import { apiServer } from '@/api/backend'

function sendPost({ title, author, desc, content }) {
  const stringifyData = qs.stringify({
    'data[title]': title,
    'data[author]': author,
    'data[desc]': desc,
    'data[content]': content
  })
  // return axios.post(`${apiServer}/ipfs/addJSON`, {
  //   data: stringifyData,
  //   config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  // });
  return axios({
    method: 'post',
    url: `${apiServer}/ipfs/addJSON`,
    data: stringifyData,
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  })
}

// eslint-disable-next-line import/prefer-default-export
export { sendPost }

// 图片上传接口
export const ifpsUpload = `${apiServer}/ipfs/upload`
