Page({
  data: {
    tasks: null,
    addr: '',
    tens: '5',
    ones: '0',
    stepCount: 250
  },

  onLoad() {
    const tasks = wx.getStorageSync('generatedTasks');
    const lastDest = wx.getStorageSync('lastDest');
    if (!tasks) {
      this.setData({ tasks: null });
      return;
    }
    this.setData({
      tasks,
      addr: lastDest?.addr || ''
    });
    this.updateStepCount();
  },

  onTens(e) {
    const v = (e.detail.value || '').replace(/\D/g, '').slice(-1);
    this.setData({ tens: v || '0' });
    this.updateStepCount();
  },

  onOnes(e) {
    const v = (e.detail.value || '').replace(/\D/g, '').slice(-1);
    this.setData({ ones: v || '0' });
    this.updateStepCount();
  },

  updateStepCount() {
    const t = parseInt(this.data.tens, 10) || 0;
    const o = parseInt(this.data.ones, 10) || 0;
    const x = Math.min(18, t + o);
    this.setData({ stepCount: 50 * x });
  },

  copyAll() {
    const t = this.data.tasks;
    if (!t) return;
    const lastDest = wx.getStorageSync('lastDest') || {};
    let text = `今日冒险任务\n目的地：${lastDest.addr || ''}\n主题：${t.theme}\n\n【主线任务】\n`;
    t.main.forEach((m, i) => { text += `${i + 1}. ${m}\n`; });
    if (t.challenge) text += '\n【挑战题】\n' + t.challenge + '\n';
    text += '\n【支线任务】\n';
    t.side.forEach((s) => { text += `· ${s}\n`; });
    if (t.hidden && t.hidden.length) {
      text += '\n【隐藏任务】\n';
      t.hidden.forEach(h => { text += `· ${h}\n`; });
    }
    text += '\n【规则限制】\n';
    t.rules.forEach(r => { text += `· ${r}\n`; });
    text += '\n【记录】\n';
    t.record.forEach(r => { text += `· ${r}\n`; });
    text += '\n【后续】写游记、写总结、拍成 vlog';

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  }
});
