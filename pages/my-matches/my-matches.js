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
})
