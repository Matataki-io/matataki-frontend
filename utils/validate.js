// https://github.com/PanJiaChen/vue-element-admin/blob/master/src/utils/validate.js
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
