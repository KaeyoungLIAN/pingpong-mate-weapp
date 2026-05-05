/**
 * API 请求封装
 * 统一处理 baseUrl、token 鉴权、loading 提示、错误处理
 */

/**
 * 发起 HTTP 请求
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method - 请求方法
 * @param {string} url - 请求路径（相对路径，自动拼接 baseUrl）
 * @param {object} [data={}] - 请求参数
 * @returns {Promise<any>} 响应数据
 */
function request(method, url, data = {}) {
  const app = getApp()
  const token = wx.getStorageSync('token')

  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '加载中...' })

    wx.request({
      url: app.globalData.apiBaseUrl + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      success(res) {
        const { statusCode, data: body } = res

        if (statusCode >= 200 && statusCode < 300) {
          resolve(body)
        } else if (statusCode === 401) {
          // token 过期或未登录，清除登录态并跳转登录页
          wx.removeStorageSync('token')
          app.globalData.token = null
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
          wx.redirectTo({ url: '/pages/login/login' })
          reject(body)
        } else {
          wx.showToast({
            title: body?.message || `请求失败（${statusCode}）`,
            icon: 'none',
          })
          reject(body)
        }
      },
      fail(err) {
        wx.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
        reject(err)
      },
      complete() {
        wx.hideLoading()
      },
    })
  })
}

/** GET 请求 */
function get(url, data) {
  return request('GET', url, data)
}

/** POST 请求 */
function post(url, data) {
  return request('POST', url, data)
}

/** PUT 请求 */
function put(url, data) {
  return request('PUT', url, data)
}

/** DELETE 请求 */
function del(url, data) {
  return request('DELETE', url, data)
}

module.exports = { request, get, post, put, del }
