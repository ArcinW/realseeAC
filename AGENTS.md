# AGENTS.md

## 项目概览
如视空间数据平台 - 空间数据总览平台官网，纯静态单页应用。

## 技术栈
- 原生 HTML/CSS/JS (native-static)
- 无构建步骤，Python SimpleHTTPServer 提供静态文件服务

## 项目结构
```
.
├── index.html          # 主页面（完整单页应用，含 CSS/JS）
├── assets/             # 原始资源文件
│   └── index_new.html  # 源文件
├── styles/             # 样式目录（模板预留）
├── .coze               # 项目配置
└── AGENTS.md           # 项目说明
```

## 构建与运行
- 开发: `python -m http.server ${DEPLOY_RUN_PORT} --bind 0.0.0.0`
- 部署: 同上，静态文件直接服务

## 页面功能
- 首页: Hero 区域、数据分类介绍、数据总览（Tab 切换）、使用建议、选择理由、联系我们、数据集推荐
- Data Hub: 数据检索中心，支持筛选/搜索/分页/详情查看
- 粒子动画背景、滚动动画、计数器动画
- 响应式布局（PC/Mobile）
- Hash 路由：每个模块支持 URL hash 锚点（#data, #tips, #contact, #datahub 等）

## 关键功能说明
- `formatLayout()`: 将 "3-1-1-2" 格式转换为 "3室1厅1厨2卫"
- `switchPage()`: 页面切换（home/datahub），同时更新 URL hash
- `handleHash()`: 监听 hashchange 事件，支持直接访问带 hash 的 URL
- 详情页空间类型信息位于点位数之后
- 查看VR按钮采用毛玻璃胶囊样式
- 导航栏"联系我们"按钮始终高亮，进入 datahub 后不变灰

## 注意事项
- 所有图片/视频资源来自外部 CDN (realsee-cdn.cn, ljcdn.com)
- 页面包含 iframe 嵌入 VR 全景
- 数据通过 JS 数组硬编码在 HTML 中
