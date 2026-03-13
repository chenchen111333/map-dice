// 腾讯地图逆地址解析（坐标→地址）
const { QQMAP_KEY } = require('./config.js');

function reverseGeocode(lat, lng) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${lat},${lng}`,
        key: QQMAP_KEY,
        get_poi: 0
      },
      success(res) {
        if (res.data && res.data.status === 0 && res.data.result) {
          const addr = res.data.result.address || '';
          resolve(addr);
        } else {
          reject(new Error(res.data?.message || '逆地理解析失败'));
        }
      },
      fail: reject
    });
  });
}

module.exports = { reverseGeocode };
