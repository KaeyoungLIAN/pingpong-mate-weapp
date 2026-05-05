// 我的约球页 - 展示我发起的 / 我报名的约球列表
const api = require('../../utils/api')

Page({
  data: {
    activeTab: 'created',                   // 当前 tab：created | applied
    matches: [],                            // 当前列表数据
    statusLabels: {                         // 约球状态中文映射
      open: '开放',
      full: '已满员',
      cancelled: '已取消',
      completed: '已完成',
    },
  },

  /** 页面加载时加载列表 */
  onLoad() {
    this.loadMatches()
  },

  /** 切换 tab 并重新加载 */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === this.data.activeTab) return  // 重复点击跳过
    this.setData({ activeTab: tab, matches: [] })
    this.loadMatches()
  },

  /** 根据当前 activeTab 从后端加载列表 */
  async loadMatches() {
    try {
      const res = await api.get('/matches/my/')
      // 后端返回 { created: [...], applied: [...] }
      const matches = this.data.activeTab === 'created' ? res.created : res.applied
      this.setData({ matches: matches || [] })
    } catch (err) {
      console.error('加载约球列表失败：', err)
    }
  },

  /** 点击卡片跳转到约球详情页 */
  goDetail(e) {
    const matchId = e.currentTarget.dataset.matchId
    wx.navigateTo({
      url: '/pages/detail/detail?match_id=' + matchId,
    })
  },

  /** 退出登录 */
  async handleLogout() {
    const app = getApp()
    const res = await new Promise((resolve) => {
      wx.showModal({
        title: '提示',
        content: '确定退出登录吗？',
        success: (res) => resolve(res.confirm),
      })
    })
    if (!res) return

    try {
      await api.del('/users/logout/')
    } catch (err) {
      // 即使后端请求失败也清除本地登录态
      console.warn('退出登录接口调用失败：', err)
    }

    // 清除本地登录态
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    app.globalData.token = null
    app.globalData.userInfo = null

    // 跳转回登录页
    wx.reLaunch({ url: '/pages/login/login' })
  },
})
