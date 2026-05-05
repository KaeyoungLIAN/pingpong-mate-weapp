# 🏓 乒乓搭子 - 微信小程序前端

> 乒乓搭子微信小程序前端，原生开发。

## 页面

| 页面 | 路径 | 功能 |
|------|------|------|
| 登录 | `pages/login/` | 微信一键登录（mock），新用户引导完善资料 |
| 首页 | `pages/home/` | 约球列表卡片，日期/距离/水平筛选，下拉加载更多 |
| 发布 | `pages/create/` | 发布约球表单（日期/时间/地点/人数/水平/备注） |
| 详情 | `pages/detail/` | 约球完整信息、报名人列表、报名/取消、复制微信号 |
| 我的约球 | `pages/my-matches/` | Tab 切换「我发起的」「我报名的」 |
| 资料编辑 | `pages/profile-edit/` | 性别/年龄/水平/球板/胶皮/自我介绍 |

## 本地运行

1. **下载微信开发者工具**（[官网](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)）
2. **修改配置**：`project.config.json` 中 `appid` 改为你的微信小程序 AppID
3. **打开项目**：在开发者工具中导入 `pingpong-mate-weapp` 目录
4. **修改后端地址**：默认指向 `http://localhost:8001`，可在 `app.js` 的 `globalData.apiBaseUrl` 中修改
5. **编译运行**：点击开发者工具的「编译」按钮

## 项目结构

```
pingpong-mate-weapp/
├── app.js               # 应用入口
├── app.json             # 全局配置（页面注册、TabBar）
├── app.wxss             # 全局样式
├── project.config.json  # 项目配置
├── sitemap.json         # 搜索配置
├── images/              # 图片资源
├── utils/
│   └── api.js           # API 请求封装（Token 注入、错误处理）
└── pages/
    ├── login/           # 登录页
    ├── home/            # 首页 - 约球列表
    ├── create/          # 发布约球
    ├── detail/          # 约球详情
    ├── my-matches/      # 我的约球
    └── profile-edit/    # 个人资料编辑
```

## 后端 API 文档

详见 [pingpong-mate-server](https://github.com/KaeyoungLIAN/pingpong-mate-server) 的 README。
