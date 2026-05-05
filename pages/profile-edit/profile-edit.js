// 个人资料编辑页（新用户注册后首次填写 / 已有资料修改）
const api = require('../../utils/api')

const app = getApp()

Page({
  data: {
    isNew: false,          // 是否为首次填写（新用户引导）
    saving: false,         // 保存中

    // 表单字段
    nickname: '',
    gender: '',
    age: '',
    skill_level: '',
    district: '',
    paddle_type: '',
    rubber_type: '',
    bio: '',

    // 选项列表
    genderOptions: ['男', '女'],
    genderValues: ['male', 'female'],
    genderDisplay: { 'male': '男', 'female': '女' },
    skillOptions: ['1-初学者', '2-初级', '3-中级', '4-高级', '5-专业级'],
    skillLabels: { 1: '1-初学者', 2: '2-初级', 3: '3-中级', 4: '4-高级', 5: '5-专业级' },
    districtOptions: [
      '东城区', '西城区', '朝阳区', '海淀区', '丰台区',
      '石景山区', '通州区', '大兴区', '房山区', '昌平区', '顺义区',
    ],
    paddleOptions: ['横板', '直板', '日直', '异形'],
    rubberOptions: ['反胶', '正胶', '长胶', '生胶'],
  },

  /**
   * 生命周期：页面加载
   * @param {object} options - 路由参数（如 { isNew: 'true' }）
   */
  onLoad(options) {
    // 读取 token
    const token = app.globalData.token || wx.getStorageSync('token')
    if (!token) {
      wx.redirectTo({ url: '/pages/login/login' })
      return
    }
    app.globalData.token = token

    // 标记是否为新用户首次填写
    if (options.isNew === 'true') {
      this.setData({ isNew: true })
    }

    // 加载已有资料，有则回填表单
    this.loadProfile()
  },

  /** 从后端加载已有个人资料 */
  async loadProfile() {
    try {
      const profile = await api.get('/users/profile/')
      if (profile && profile.nickname) {
        this.setData({
          nickname: profile.nickname || '',
          gender: profile.gender || '',
          age: profile.age ? String(profile.age) : '',
          skill_level: profile.skill_level || '',
          district: profile.district || '',
          paddle_type: profile.paddle_type || '',
          rubber_type: profile.rubber_type || '',
          bio: profile.bio || '',
        })
      }
    } catch (err) {
      console.error('加载个人资料失败：', err)
    }
  },

  // ---- 文本输入 ----

  /** 昵称输入 */
  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  /** 年龄输入 */
  onAgeInput(e) {
    this.setData({ age: e.detail.value })
  },

  /** 个人简介输入 */
  onBioInput(e) {
    this.setData({ bio: e.detail.value })
  },

  // ---- 选择器变更 ----

  /** 性别选择 */
  onGenderChange(e) {
    const index = e.detail.value
    this.setData({
      gender: this.data.genderValues[index],
    })
  },

  /** 技能等级选择 */
  onSkillChange(e) {
    const index = e.detail.value
    this.setData({
      skill_level: String(Number(index) + 1),
    })
  },

  /** 所在区域选择 */
  onDistrictChange(e) {
    const index = e.detail.value
    this.setData({
      district: this.data.districtOptions[index],
    })
  },

  /** 球拍类型选择 */
  onPaddleChange(e) {
    const index = e.detail.value
    this.setData({
      paddle_type: this.data.paddleOptions[index],
    })
  },

  /** 胶皮类型选择 */
  onRubberChange(e) {
    const index = e.detail.value
    this.setData({
      rubber_type: this.data.rubberOptions[index],
    })
  },

  // ---- 提交 ----

  /** 保存个人资料 */
  async handleSave() {
    if (this.data.saving) return
    this.setData({ saving: true })

    try {
      await api.put('/users/profile/', {
        nickname: this.data.nickname,
        gender: this.data.gender,
        age: this.data.age ? Number(this.data.age) : null,
        skill_level: this.data.skill_level,
        district: this.data.district,
        paddle_type: this.data.paddle_type,
        rubber_type: this.data.rubber_type,
        bio: this.data.bio,
      })

      wx.showToast({ title: '保存成功', icon: 'success' })

      // 保存后跳转首页
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/home/home' })
      }, 1500)
    } catch (err) {
      console.error('保存个人资料失败：', err)
    } finally {
      this.setData({ saving: false })
    }
  },

  /** 跳过，直接进入首页 */
  skipProfile() {
    wx.reLaunch({ url: '/pages/home/home' })
  },
})
