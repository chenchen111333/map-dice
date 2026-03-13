/**
 * 地图掷骰子 - 动态任务生成引擎
 * 3 套场景任务库、隐藏任务升级、电量结果直出（无公式）
 */
(function (global) {
  'use strict';

  async function getBatteryX() {
    try {
      const battery = await navigator.getBattery();
      const level = battery.level ?? 0;
      const pct = Math.floor(level * 100);
      const tens = Math.floor(pct / 10);
      const units = pct % 10;
      const X = Math.min(18, tens + units);
      return { X, steps: 50 * X, pct };
    } catch (_) {
      return { X: 9, steps: 450, pct: 90 };
    }
  }

  function replaceVars(text, vars) {
    return Object.entries(vars).reduce((s, [k, v]) => s.replace(new RegExp('\\{' + k + '\\}', 'g'), String(v)), text);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const SHOP_TYPES = ['书店', '展览馆', '咖啡店', '花店', '奶茶店', '甜品店', '面包房', '旧货市场'];

  const TASK_SETS = {
    shop: {
      name: '探店风',
      main: [
        '在{place}周边 200–500 米内找一个地标（立交桥、雕塑、店招），摆一个从未在社交媒体发过的姿势打卡合影。',
        '关闭导航 App，在{place}附近找公交站，下一班车不管去哪都上车坐 1 站。',
        '下车后朝车尾方向行走 {steps} 步。',
        '用不超过 5 个字问路人「最近甜品店在哪」，按 TA 说的去，买一份从没吃过的东西。',
        '找一家你从没去过的{shop}，在里面待满 15 分钟，观察并拍 3 张照片。',
        '在{street}找一条从未走过的巷子或小路，从头走到尾。',
        '在{place}找一个红色遮阳伞或代表性店招，完成「冒险契约」风格合影。'
      ]
    },
    nature: {
      name: '自然风',
      main: [
        '在{place}东侧 200–500 米内寻找标志物（桥墩、雕塑、大树），摆一个从未摆过的姿势完成打卡。',
        '关闭导航，在{place}附近找公交站，下一班车直接上车坐 1 站。',
        '下车后朝车尾方向行走 {steps} 步。',
        '问路人（限 5 字）「甜品店在哪」，去那里买一份从没吃过的东西。',
        '在{place}找一棵你认为最有故事的树或建筑，与它「对话」姿势合影。',
        '买一份当地小吃，找一个景色最好的地方吃掉。',
        '给同伴拍一张「电影海报风格」的照片。'
      ]
    },
    urban: {
      name: '城市冒险风',
      main: [
        '在{place}周边 200–500 米内找一个地标打卡，拍一张此前从未摆过的姿势。',
        '关闭导航 App，随机找公交站，不管下一辆公交是什么都上车坐 1 站。',
        '下车后朝车尾方向行走 {steps} 步。',
        '通过问路人找到最近的{shop}，买一个从没吃过/用过的东西。',
        '在地图上以{place}为中心，步行 20 分钟内能到的范围随机选一个点，让对方用 10 个「是/否」问题猜出并带你去。',
        '问一个路人「这附近最有意思的地方是哪儿？」，按 TA 说的去一趟。',
        '在{place}找一个红色遮阳伞或地标，完成冒险契约合影。'
      ]
    }
  };

  const HIDDEN_TEMPLATES = [
    '街景寻觅：一方提供街景图，对方 20 分钟内找出拍摄地点并拍同样角度。完成 +20 元经费。',
    '勇往直前：一方选定一店不告知对方，给一个方向，对方带你直行（可停不可转弯回头），10 分钟内到达。失败方给胜方买小奖品。',
    '勇往直前：10 分钟内不准回头，走到路尽头找一家店买小奖品。',
    '盲选午餐：闭眼在地图上点一个点，去最近的那家店吃东西。',
    '双人寻踪：一方选地图 2km 内某处写在手机里，对方用 10 个「是/否」问题找到并带你去。失败方请客下一顿。'
  ];

  async function generateTasksAsync(poi, options = {}) {
    const placeName = poi.name || '目的地';
    const addr = (poi.pname || '') + (poi.address || '') || '';
    const street = addr.match(/[\u4e00-\u9fa5]{2,8}(?:街|路|道|巷|胡同|镇|乡)/)?.[0] || '附近街道';
    const shop = pickRandom(SHOP_TYPES);

    const { steps } = await getBatteryX();
    const budget = options.budget ?? 50;
    const words = options.words ?? 5;
    const showHidden = Math.random() < 0.6;

    const vars = { place: placeName, street, shop, steps, budget, words };

    const setKey = pickRandom(['shop', 'nature', 'urban']);
    const taskSet = TASK_SETS[setKey];
    const main = taskSet.main.map(t => replaceVars(t, vars));

    const restrictions = [
      replaceVars('今日与路人说话必须严格限制为每句 {words} 个字。', { words }),
      replaceVars('今日初始经费 {budget} 元，全程只用支付宝支付。', { budget })
    ];

    let hidden = null;
    if (showHidden) {
      hidden = pickRandom(HIDDEN_TEMPLATES);
    }

    return {
      main,
      side: [],
      restrictions,
      challenge: null,
      hidden,
      budget,
      words,
      steps,
      theme: taskSet.name
    };
  }

  global.MissionLogic = {
    generateTasksAsync,
    getBatteryX
  };
})(typeof window !== 'undefined' ? window : globalThis);
