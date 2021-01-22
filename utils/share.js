export const renderLinkUser = (dom) => {
  let div = document.createElement('div')
  div.innerHTML = dom

  let linkAll = div.querySelectorAll('a.tribute-mention')
  Array.prototype.slice.apply(linkAll).forEach(ele => {
    let userId = ele.getAttribute('data-user')
    ele.setAttribute('href', `/user/${userId}`)
    ele.setAttribute('target', '_blank')
  })

  return (div.innerHTML).toString()
}