import axios from 'axios'
import qs from 'qs'
import { apiServer } from '@/request/backend'

function sendPost({ title, author, desc, content }) {
  const stringifyData = qs.stringify({
    'data[title]': title,
    'data[author]': author,
    'data[desc]': desc,
    'data[content]': content
  })
  // return axios.post(`${apiServer}/post/ipfs`, {
  //   data: stringifyData,
  //   config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  // });
  return axios({
    method: 'post',
    url: `${apiServer}/post/ipfs`,
    data: stringifyData,
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  })
}

export { sendPost }

// 图片上传接口
export const ifpsUpload = `${apiServer}/ipfs/upload`
