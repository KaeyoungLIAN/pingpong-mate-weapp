// pages/home/home.js
// 首页 - 赛事列表

const api = require('../../utils/api')

Page({
  data: {
    matches: [],                    // 赛事列表
    page: 1,                        // 当前页码
    loading: false,                 // 加载中
    hasMore: true,                  // 是否还有更多
    filterDate: '',                 // 日期筛选
    filterDistance: 0,              // 距离筛选索引: 0=不限 1=3km 2=5km 3=10km
    filterLevel: 0,                 // 水平筛选索引: 0=不限 1=和我差不多
    distanceOptions: ['不限', '3km内', '5km内', '10km内'],
    distanceLabels: ['距离:不限', '3km内', '5km内', '10km内'],
    levelFilterOptions: ['不限', '和我差不多'],
    levelFilterLabels: ['水平:不限', '和我差不多'],
  },

  onLoad() {
    this.loadMatches()
  },

  // 下拉刷新 - 重置到第一页
  onPullDownRefresh() {
    this.data.page = 1
    this.loadMatches().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 触底加载更多
  onReachBottom() {
    this.loadMore()
  },

  // 加载赛事列表（page=1 时替换列表，否则追加）
  async loadMatches() {
    if (this.data.loading) return
    this.setData({ loading: true })

    try {
      const { page, filterDate, filterDistance, filterLevel } = this.data
      const params = { page }

      // 日期筛选
      if (filterDate) {
        params.date = filterDate
      }
      // 距离筛选: 索引转实际公里数
      if (filterDistance > 0) {
        params.distance = [3, 5, 10][filterDistance - 1]
      }
      // 水平筛选：传当前用户水平（让后端筛选低于该水平的）
      if (filterLevel === 1) {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo && userInfo.skill_level) {
          params.skill_level_required = userInfo.skill_level
        }
      }

      const res = await api.get('/matches/', params)
      // 支持分页格式 { results: [...], next: '...' } 和直接数组
      const newMatches = res.results || res

      if (page === 1) {
        this.setData({ matches: newMatches })
      } else {
        this.setData({ matches: this.data.matches.concat(newMatches) })
      }

      this.setData({
        page: page + 1,
        hasMore: res.next != null,
      })
    } catch (err) {
      console.error('加载赛事列表失败：', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 加载下一页
  loadMore() {
    if (!this.data.hasMore || this.data.loading) return
    this.loadMatches()
  },

  // 日期筛选变更
  onDateFilter(e) {
    this.setData({ filterDate: e.detail.value, page: 1 })
    this.loadMatches()
  },

  // 距离筛选变更
  onDistanceFilter(e) {
    this.setData({ filterDistance: Number(e.detail.value), page: 1 })
    this.loadMatches()
  },

  // 水平筛选变更
  onLevelFilter(e) {
    this.setData({ filterLevel: Number(e.detail.value), page: 1 })
    this.loadMatches()
  },

  // 清除所有筛选
  clearFilter() {
    this.setData({
      filterDate: '',
      filterDistance: 0,
      filterLevel: 0,
      page: 1,
    })
    this.loadMatches()
  },

  // 跳转赛事详情
  goDetail(e) {
    const matchId = e.currentTarget.dataset.matchId
    wx.navigateTo({ url: `/pages/detail/detail?match_id=${matchId}` })
  },

  // 跳转创建赛事
  goCreate() {
    wx.navigateTo({ url: '/pages/create/create' })
  },
})
