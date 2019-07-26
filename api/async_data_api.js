export const recommend = (axios, channel) => {
  const path = '/posts/recommend?channel='
  return axios.get(path + channel)
}
