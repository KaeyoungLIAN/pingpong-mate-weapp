// 约球详情页
const api = require('../../utils/api')

const app = getApp()

Page({
  data: {
    match: {},
    isCreator: false,
    isApplied: false,
    applying: false,
    cancelling: false,
    statusLabels: {
      pending: '待确认',
      accepted: '已通过',
      rejected: '已拒绝',
      cancelled: '已取消',
    },
  },

  /**
   * 页面加载：获取约球详情
   * @param {object} options 路由参数，含 match_id
   */
  onLoad(options) {
    // 检查登录态
    if (!app.globalData.token && !wx.getStorageSync('token')) {
      wx.redirectTo({ url: '/pages/login/login' })
      return
    }

    const matchId = options.match_id
    if (!matchId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      return
    }

    this.loadMatchDetail(matchId)
  },

  /** 从后端加载约球详情，并判断当前用户身份 */
  async loadMatchDetail(matchId) {
    try {
      const res = await api.get('/matches/' + matchId + '/')

      // 获取当前登录用户信息（首次登录时已存入 storage 和 globalData）
      const currentUser = app.globalData.userInfo || wx.getStorageSync('userInfo')

      // 判断当前用户是否为发起人
      const isCreator = currentUser && res.creator && res.creator.id === currentUser.id

      // 判断当前用户是否已报名
      const isApplied = res.applicants
        ? res.applicants.some(function (item) {
            return item.user && item.user.id === (currentUser ? currentUser.id : null)
          })
        : false

      this.setData({
        match: res,
        isCreator: isCreator,
        isApplied: isApplied,
      })
    } catch (err) {
      console.error('加载约球详情失败：', err)
    }
  },

  /** 报名 / 取消报名 */
  async handleApply() {
    if (this.data.applying) return

    const matchId = this.data.match.id
    if (!matchId) return

    this.setData({ applying: true })

    try {
      if (this.data.isApplied) {
        // 已报名 → 取消报名
        await api.post('/matches/' + matchId + '/cancel-apply/')
        wx.showToast({ title: '已取消报名', icon: 'success' })
      } else {
        // 未报名 → 报名
        await api.post('/matches/' + matchId + '/apply/')
        wx.showToast({ title: '报名成功', icon: 'success' })
      }
      // 操作成功后刷新详情
      this.loadMatchDetail(matchId)
    } catch (err) {
      console.error('报名/取消操作失败：', err)
    } finally {
      this.setData({ applying: false })
    }
  },

  /** 发起人取消整场约球 */
  async handleCancelMatch() {
    if (this.data.cancelling) return

    const matchId = this.data.match.id
    if (!matchId) return

    // 二次确认弹窗
    const modalRes = await new Promise(function (resolve) {
      wx.showModal({
        title: '确认取消',
        content: '确定要取消这个约球吗？取消后所有报名将失效。',
        success: function (res) {
          resolve(res.confirm)
        },
      })
    })

    if (!modalRes) return

    this.setData({ cancelling: true })

    try {
      await api.del('/matches/' + matchId + '/')
      wx.showToast({ title: '已取消', icon: 'success' })
      wx.navigateBack()
    } catch (err) {
      console.error('取消约球失败：', err)
    } finally {
      this.setData({ cancelling: false })
    }
  },

  /** 复制发起人微信号到剪贴板 */
  copyWechat() {
    const wechat = this.data.match.wechat
    if (!wechat) {
      wx.showToast({ title: '暂无微信号', icon: 'none' })
      return
    }

    wx.setClipboardData({
      data: wechat,
      success: function () {
        wx.showToast({ title: '已复制微信号', icon: 'success' })
      },
    })
  },
})
