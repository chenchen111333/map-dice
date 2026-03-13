// 随机任务生成
const SHOP_TYPES = ['书店','展览馆','咖啡店','公园','花店','饭馆','奶茶店','超市','甜品店','面包房','文具店','旧货市场'];
const MAIN_POOL = [
  '在{place}周边200-500米内找一个地标打卡，拍一张此前从未摆过的姿势的照片。',
  '关闭导航，随机找一个公交站，不管下一辆公交是什么都上车坐1站。',
  '下车后，朝车尾方向走{steps}步（X=手机电量十位+个位，如87%则X=15，走50×X步）。',
  '通过问路人，找到最近的{shop}，买一个从没吃过/用过的东西。',
  '跟{shop}门口合影。',
  '在地图上以{place}为中心，步行20分钟内能到的范围内，随机选一个点作为秘密目的地，让对方用10个「是/否」问题猜出并带你去。',
  '找一家你从没去过的{shop}，在里面待满15分钟，观察并拍3张照片。',
  '在{street}找一条你从未走过的巷子或小路，从头走到尾。',
  '问一个路人「这附近最有意思的地方是哪儿？」，按TA说的去一趟。'
];
const SIDE_POOL = [
  '就近找个能坐的地方，读一本书的第一章（自带或买一本）。',
  '在书中找到一句最能形容此刻街道氛围的句子，拍下句子与街景的对照图。',
  '路途中模仿一个公共雕塑（不一定是人）的姿势拍照。',
  '路途中找到一个你之前从没见过的东西拍照。',
  '路途中找到一个你认为「奇葩」的事物拍照。',
  '买一份当地小吃，找一个景色最好的地方吃掉。',
  '找一家老字号或本地人常去的店，进去坐坐。',
  '给同伴拍一张「电影海报风格」的照片。',
  '收集3样「只有在这条街才能买到」的小物件（拍照即可）。'
];
const CHALLENGE_POOL = [
  '双人寻踪：一方以当前所在店铺为圆心，选定地图2km内某一处（如某公园北门、某店）写在手机里不告诉对方。对方通过10个「是/否」问题找到该地并带你去。完成则请客下一顿，否则由对方今日预算支付。',
  '街景寻觅：一方提供一张街景图，对方20分钟内找出拍摄地点并拍同样角度的照片。完成则给对方今日经费+20元。',
  '勇往直前：一方选定一店不告知对方，给一个方向，对方带你直行（可停不可转弯回头），10分钟内到达。每2分钟可问「到了吗？」按规则回答。失败方给胜方买小奖品。'
];
const HIDDEN_POOL = [
  '街景寻觅：一方提供街景图，对方20分钟内找出地点并拍同样角度。完成+20元经费。',
  '勇往直前：一方选店给方向，对方直行到达。每2分钟可问「到了吗？」失败方买小奖品。',
  '盲选午餐：闭眼在地图上点一个点，去最近的那家店吃东西。'
];
const RULES_POOL = [
  '与路人说话时，每句必须正好{words}个字（不能多也不能少）。',
  '今日初始经费{budget}元（全程只用支付宝支付，方便计算）。',
  '全程不能看手机地图，只能问路。',
  '每完成一个主线任务才能看一次手机。',
  '今日只能说方言/外语（根据所在地灵活调整）。'
];
const RECORD_PROMPTS = [
  '今天最新奇/意外的事是什么？',
  '今天最有趣/好看的事是什么？',
  '今天最满意的照片是哪张？为照片写下一句纯粹的感官描述。'
];

function parseAddress(addr) {
  if (!addr) return { area: '', street: '', place: '目的地' };
  const area = (addr.match(/([\u4e00-\u9fa5]{2,4}区)/) || [])[1] || '';
  const street = (addr.match(/([\u4e00-\u9fa5]{2,8}(?:镇|乡|街道|大街|路))/) || [])[1] || '';
  const place = (addr.match(/([\u4e00-\u9fa5]{2,12}(?:路|街|巷|村|里|广场|市场|大厦|中心|桥|门))/) || [])[1]
    || (addr.match(/([\u4e00-\u9fa5]{4,20})/) || [])[1]?.slice(0, 10)
    || addr.slice(0, 15) || '此处';
  return { area, street, place };
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateRandomTasks(addr) {
  const { area, street, place } = parseAddress(addr);
  const shop = SHOP_TYPES[Math.floor(Math.random() * SHOP_TYPES.length)];
  const budget = [30, 50, 80, 100][Math.floor(Math.random() * 4)];
  const words = [3, 5, 7][Math.floor(Math.random() * 3)];
  const steps = '50×X（X=电量十位+个位）';
  const replace = s => String(s)
    .replace(/\{place\}/g, place || '目的地')
    .replace(/\{area\}/g, area || '该区')
    .replace(/\{street\}/g, street || '附近')
    .replace(/\{shop\}/g, shop)
    .replace(/\{steps\}/g, steps)
    .replace(/\{budget\}/g, String(budget))
    .replace(/\{words\}/g, String(words));
  const mainCount = 4 + Math.floor(Math.random() * 2);
  const sideCount = 3 + Math.floor(Math.random() * 3);
  const main = pickRandom(MAIN_POOL, mainCount).map(replace);
  const side = pickRandom(SIDE_POOL, sideCount).map(replace);
  const challenge = pickRandom(CHALLENGE_POOL, 1).map(replace)[0];
  const hidden = pickRandom(HIDDEN_POOL, 1 + Math.floor(Math.random() * 2)).map(replace);
  const rules = pickRandom(RULES_POOL, 1 + Math.floor(Math.random() * 2)).map(replace);
  return {
    theme: pickRandom(SHOP_TYPES, 6).join('、'),
    main, side, challenge, hidden, rules,
    record: [...RECORD_PROMPTS],
    place, area, street, shop, budget, steps
  };
}

module.exports = {
  generateRandomTasks
};
