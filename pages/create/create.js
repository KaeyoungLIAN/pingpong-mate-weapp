// 发布约球页
const api = require('../../utils/api')

Page({
  data: {
    date: '',
    time_start: '',
    time_end: '',
    district: '',
    max_players: 4,
    skill_level_required: null,
    notes: '',
    publishing: false,
    // 日期选择器的最小值（今天）
    minDate: '',
    // 下拉选项
    districtOptions: [
      '东城区', '西城区', '朝阳区', '海淀区', '丰台区',
      '石景山区', '通州区', '大兴区', '房山区', '昌平区', '顺义区',
    ],
    playerOptions: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    skillOptions: ['不限', '初学者', '初级', '中级', '高级', '专业级'],
  },

  onLoad() {
    // 设置 minDate 为今天（格式 YYYY-MM-DD）
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    this.setData({ minDate: `${y}-${m}-${d}` })
  },

  // 选择日期
  onDateChange(e) {
    this.setData({ date: e.detail.value })
  },

  // 选择开始时间
  onTimeStartChange(e) {
    this.setData({ time_start: e.detail.value })
  },

  // 选择结束时间
  onTimeEndChange(e) {
    this.setData({ time_end: e.detail.value })
  },

  // 选择区域
  onDistrictChange(e) {
    const index = e.detail.value
    this.setData({ district: this.data.districtOptions[index] })
  },

  // 选择最大人数
  onPlayersChange(e) {
    const index = e.detail.value
    this.setData({ max_players: this.data.playerOptions[index] })
  },

  // 选择水平要求
  onSkillChange(e) {
    const index = e.detail.value
    // 索引 0 = "不限" → null；1~5 对应 1~5 级
    this.setData({ skill_level_required: index === 0 ? null : index })
  },

  // 备注输入
  onNotesInput(e) {
    this.setData({ notes: e.detail.value })
  },

  // 发布约球
  async handlePublish() {
    const { date, time_start, time_end, district } = this.data

    // 验证必填字段
    if (!date) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }
    if (!time_start) {
      wx.showToast({ title: '请选择开始时间', icon: 'none' })
      return
    }
    if (!time_end) {
      wx.showToast({ title: '请选择结束时间', icon: 'none' })
      return
    }
    if (!district) {
      wx.showToast({ title: '请选择所在区', icon: 'none' })
      return
    }

    this.setData({ publishing: true })

    try {
      await api.post('/matches/', {
        date: this.data.date,
        time_start: this.data.time_start,
        time_end: this.data.time_end,
        district: this.data.district,
        max_players: this.data.max_players,
        skill_level_required: this.data.skill_level_required,
        notes: this.data.notes,
      })
      wx.showToast({ title: '发布成功', icon: 'success' })
      wx.navigateBack()
    } catch (err) {
      console.error('发布约球失败：', err)
    } finally {
      this.setData({ publishing: false })
    }
  },
})
