const BASE_URL = '/arlanzon'

const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        Authorization: sessionStorage.getItem('token'),
      },
      timeout: 8000,
      dataType: 'json',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

export default request
