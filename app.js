App({
  globalData: {
    userInfo: null,
    token: null,
    apiBaseUrl: 'http://192.168.1.36:8001/api'
  },

  onLaunch() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    }
  }
})
