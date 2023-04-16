const BASE_URL = '/arlanzon'

const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        Authorization: uni.getStorageSync('token'),
      },
      timeout: 8000,
      dataType: 'json',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        uni.$u.toast('请求超时')
      },
    })
  })
}

export default request
