// 仅用于 import && export
// 使用例子
// 之前: `import { xxx } from '@/api/backend'`
// 之后: `import { xxx } from '@/api/'`
import API, { accessTokenAPI } from './backend'
import defaultImagesUploader from './imagesUploader'

export {
  API as backendAPI,
  // 額外項
  accessTokenAPI,
  defaultImagesUploader
}
