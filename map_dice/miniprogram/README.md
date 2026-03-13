# 地图掷骰子 - 微信小程序版

和网页版功能一致：选择范围 → 掷骰子随机选地点 → 查看自动生成的冒险任务。

---

## 使用前准备

### 1. 注册微信小程序

1. 打开 [微信公众平台](https://mp.weixin.qq.com/)
2. 点击「立即注册」→ 选择「小程序」
3. 按提示完成注册，获得 **AppID**

### 2. 申请腾讯地图 Key

1. 打开 [腾讯位置服务](https://lbs.qq.com/)
2. 注册并登录，进入控制台
3. 创建应用，类型选择 **「微信小程序」**
4. 获取 **Key**，记下备用

### 3. 配置小程序

1. 打开 `utils/config.js`，将 `QQMAP_KEY` 换成你的腾讯地图 Key：
   ```javascript
   const QQMAP_KEY = '你的腾讯地图Key';
   ```

2. 打开 `project.config.json`，将 `appid` 换成你的小程序 AppID：
   ```json
   "appid": "你的小程序AppID"
   ```

### 4. 配置微信公众平台

1. 登录 [微信公众平台](https://mp.weixin.qq.com/) → 进入你的小程序
2. 左侧 **开发** → **开发管理** → **开发设置**
3. 找到 **「服务器域名」** → **request 合法域名**
4. 添加：`https://apis.map.qq.com`
5. 保存

---

## 如何运行

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

2. 打开微信开发者工具，选择「导入项目」

3. 项目目录选择本项目的 **`miniprogram` 文件夹**（注意是 miniprogram 这个子文件夹，不是 map_dice 根目录）

4. AppID 填写你的小程序 AppID（或选「测试号」先本地体验）

5. 点击「编译」，即可在模拟器或真机上预览

---

## 项目结构

```
miniprogram/
├── app.js              # 小程序入口
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── project.config.json # 项目配置
├── pages/
│   ├── index/          # 首页：选择范围、掷骰子、地图
│   └── task/            # 任务页：今日冒险任务
└── utils/
    ├── config.js       # 腾讯地图 Key 配置
    ├── geo.js          # 区域与随机选点逻辑
    ├── api.js          # 腾讯地图逆地理 API
    └── task.js         # 随机任务生成
```

---

## 与网页版的关系

- **网页版**（`index.html`）在 `map_dice` 根目录，未做任何修改
- **小程序版** 在 `miniprogram/` 文件夹，可独立导入微信开发者工具使用
- 两者功能一致，核心逻辑（区域、任务池）已复用

---

## 常见问题

**Q：地图不显示？**  
A：检查 `utils/config.js` 中的 Key 是否正确，以及微信公众平台是否已添加 `https://apis.map.qq.com` 到 request 合法域名。

**Q：逆地理解析失败？**  
A：确认腾讯地图 Key 的「应用类型」选择了「微信小程序」，并确保该 Key 已关联你的小程序 AppID。

**Q：真机预览需要发布吗？**  
A：不需要。在开发者工具中点击「预览」，扫码即可在真机上体验。正式上线需要在微信公众平台提交审核。
