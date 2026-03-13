# 地图掷骰子

基于高德地图的随机地点选取工具。选择范围后点击「掷骰子」，将在指定区域内随机选取一个安全地点（尽量避开军事禁区和水域）。

## 功能

- **范围选择**：北京市六环内 / 北京全市
- **Canvas 骰子动画**：HTML5 Canvas 实现的骰子滚动效果
- **安全地点**：通过逆地理编码过滤水域及军事相关区域

## 使用前准备

1. 前往 [高德开放平台](https://lbs.amap.com/) 注册并创建应用
2. 申请 **Web 端（JS API）** 的 Key
3. 获取 **安全密钥**（2021年12月后申请的 Key 必须配合使用）

## 配置

打开 `index.html`，修改以下两行：

```javascript
const AMAP_KEY = 'YOUR_AMAP_KEY';           // 替换为你的 Key
const AMAP_SECURITY_CODE = 'YOUR_AMAP_SECURITY_CODE';  // 替换为你的安全密钥
```

## 运行

在浏览器中直接打开 `index.html`，或使用本地服务器：

```bash
# 例如使用 Python
python -m http.server 8000

# 或使用 Node.js serve
npx serve .
```

## 技术说明

- 高德地图 JS API 2.0
- Canvas 2D 骰子动画（旋转 + 弹跳）
- 逆地理编码（Geocoder）用于地址与安全校验
