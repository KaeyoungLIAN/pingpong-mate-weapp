// 登录页
const api = require('../../utils/api')

const app = getApp()

Page({
  data: {
    loading: false,
  },

  onLoad() {
    // 检查是否已登录，有 token 直接跳首页
    const token = wx.getStorageSync('token')
    if (token) {
      app.globalData.token = token
      wx.reLaunch({ url: '/pages/home/home' })
    }
  },

  // 微信一键登录
  async handleLogin() {
    if (this.data.loading) return
    this.setData({ loading: true })

    try {
      // 1. 获取微信登录 code
      const { code } = await wx.login()

      // 2. 调用后端登录接口
      const res = await api.post('/users/login/', { code })
      const { token, user_info: userInfo, is_new: isNew } = res

      // 3. 保存登录态
      wx.setStorageSync('token', token)
      wx.setStorageSync('userInfo', userInfo)
      app.globalData.token = token
      app.globalData.userInfo = userInfo

      // 4. 根据是否新用户跳转
      if (isNew) {
        wx.redirectTo({ url: '/pages/profile-edit/profile-edit' })
      } else {
        wx.reLaunch({ url: '/pages/home/home' })
      }
    } catch (err) {
      console.error('登录失败：', err)
    } finally {
      this.setData({ loading: false })
    }
  },
})
