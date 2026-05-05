// 登录页 - Demo 模式，选择用户登录
const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    loading: false,
    users: [
      { id: 'A', name: '小张', initials: '张', level: 3, district: '朝阳区', bio: '横板反胶·中级', color: '#e74c3c' },
      { id: 'B', name: '小李', initials: '李', level: 1, district: '海淀区', bio: '直板正胶·初级', color: '#2ecc71' },
      { id: 'C', name: '小王', initials: '王', level: 5, district: '东城区', bio: '横板反胶·专业', color: '#3498db' },
    ],
  },

  onLoad() {
    // 已登录自动跳首页
    const token = wx.getStorageSync('token')
    if (token) {
      app.globalData.token = token
      wx.reLaunch({ url: '/pages/home/home' })
    }
  },

  async handleLogin(e) {
    if (this.data.loading) return
    const userId = e.currentTarget.dataset.userId
    this.setData({ loading: true })

    try {
      const res = await api.post('/users/login/', { user_id: userId })
      const { token, user: userInfo, is_new: isNew } = res

      wx.setStorageSync('token', token)
      wx.setStorageSync('userInfo', userInfo)
      app.globalData.token = token
      app.globalData.userInfo = userInfo

      wx.reLaunch({ url: '/pages/home/home' })
    } catch (err) {
      console.error('登录失败：', err)
      wx.showToast({ title: '登录失败，请重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },
})
