App({
  globalData: {
    userInfo: null,
    token: null,
    apiBaseUrl: 'http://localhost:8001/api'
  },

  onLaunch() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    }
  }
})
