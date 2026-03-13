const { AREAS, randomPointInArea, isUnsafeAddress } = require('../../utils/geo.js');
const { reverseGeocode } = require('../../utils/api.js');
const { generateRandomTasks } = require('../../utils/task.js');

const AREA_IDS = ['sixth-ring', 'beijing', 'shanhe-four', 'china', 'world'];
const AREA_NAMES = ['北京市六环内', '北京全市', '山河四省', '全中国', '全世界'];
const AREA_VIEWS = {
  'sixth-ring': { lng: 116.4, lat: 39.9, scale: 10 },
  'beijing': { lng: 116.4, lat: 39.9, scale: 9 },
  'shanhe-four': { lng: 116.5, lat: 36.5, scale: 6 },
  'china': { lng: 105, lat: 35, scale: 4 },
  'world': { lng: 20, lat: 20, scale: 2 }
};

Page({
  data: {
    step: 1,
    areaIndex: 0,
    areaLabels: AREA_NAMES.map((name, i) => ({ id: AREA_IDS[i], name })),
    isRolling: false,
    destAddr: '',
    destLng: null,
    destLat: null,
    mapLng: 116.397428,
    mapLat: 39.90923,
    mapScale: 10,
    markers: []
  },

  onAreaChange(e) {
    const i = Number(e.detail.value);
    this.setData({ areaIndex: i });
    const id = AREA_IDS[i];
    const v = AREA_VIEWS[id] || AREA_VIEWS.beijing;
    this.setData({
      mapLng: v.lng,
      mapLat: v.lat,
      mapScale: v.scale
    });
  },

  selectArea(e) {
    const i = Number(e.currentTarget.dataset.index);
    this.setData({ areaIndex: i });
    const id = AREA_IDS[i];
    const v = AREA_VIEWS[id] || AREA_VIEWS.beijing;
    this.setData({
      mapLng: v.lng,
      mapLat: v.lat,
      mapScale: v.scale
    });
  },

  goStep2() {
    this.setData({ step: 2 });
    const id = AREA_IDS[this.data.areaIndex];
    const v = AREA_VIEWS[id] || AREA_VIEWS.beijing;
    this.setData({
      mapLng: v.lng,
      mapLat: v.lat,
      mapScale: v.scale
    });
  },

  rollDice() {
    if (this.data.isRolling) return;
    this.setData({ isRolling: true });
    const areaId = AREA_IDS[this.data.areaIndex];
    const area = AREAS[areaId];
    const maxRetries = areaId === 'world' ? 30 : (areaId === 'china' ? 25 : 20);

    const tryFind = (attempt) => {
      const [lng, lat] = randomPointInArea(area);
      reverseGeocode(lat, lng).then(addr => {
        if (isUnsafeAddress(addr) && attempt < maxRetries) {
          tryFind(attempt + 1);
          return;
        }
        const tasks = generateRandomTasks(addr);
        wx.setStorageSync('generatedTasks', tasks);
        wx.setStorageSync('lastDest', { lng, lat, addr });
        this.setData({
          step: 3,
          isRolling: false,
          destAddr: addr,
          destLng: lng,
          destLat: lat,
          mapLng: lng,
          mapLat: lat,
          mapScale: 16,
          markers: [{
            id: 1,
            latitude: lat,
            longitude: lng,
            width: 30,
            height: 30
          }]
        });
      }).catch(() => {
        if (attempt < maxRetries) {
          tryFind(attempt + 1);
        } else {
          this.setData({
            step: 3,
            isRolling: false,
            destAddr: '目的地（逆地理解析失败，请重试）',
            destLng: lng,
            destLat: lat,
            mapLng: lng,
            mapLat: lat,
            mapScale: 16,
            markers: [{
              id: 1,
              latitude: lat,
              longitude: lng,
              width: 30,
              height: 30
            }]
          });
        }
      });
    };
    tryFind(0);
  },

  openMap() {
    const { destLat, destLng, destAddr } = this.data;
    if (!destLat || !destLng) return;
    wx.openLocation({
      latitude: destLat,
      longitude: destLng,
      name: destAddr.slice(0, 50),
      scale: 16
    });
  },

  goTask() {
    wx.navigateTo({
      url: '/pages/task/task'
    });
  },

  redo() {
    this.setData({
      step: 2,
      destAddr: '',
      destLng: null,
      destLat: null,
      markers: [],
      mapLng: 116.397428,
      mapLat: 39.90923,
      mapScale: 10
    });
    const id = AREA_IDS[this.data.areaIndex];
    const v = AREA_VIEWS[id] || AREA_VIEWS.beijing;
    this.setData({
      mapLng: v.lng,
      mapLat: v.lat,
      mapScale: v.scale
    });
  }
});
