import { defineStore } from 'pinia'

export const useFlexibleHoursStore = defineStore('flexibleHours', {
  state: () => ({
    bigFrame: {
      start_date: "2025-10-01",
      end_date: "2025-10-25",
      min_leave_default: {
        "蔡芝瑜112555": 8,
        "歐孟真113519": 8,
        "陳慧陽115340": 9,
        "林敬傑112274": 8,
        "王雅婷114884": 9,
        "吳巒恩112715": 8,
        "陳雅慧115590": 7,
        "蔡靖雪115776": 9,
        "林怡汶109571": 8,
        "陳曉螢114167": 8,
        "陳姿芳115125": 8,
        "丁眉束": 9,
        "王于鳳116274": 8,
      }
    },
    smallFrame: {
      "蔡芝瑜112555": [{ id: 1, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 2, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "歐孟真113519": [{ id: 3, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 4, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "陳慧陽115340": [{ id: 5, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 6, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "王于鳳116274": [{ id: 7, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 8, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "林敬傑112274": [{ id: 9, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 10, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "王雅婷114884": [{ id: 11, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 12, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "吳巒恩112715": [{ id: 13, start_day: 0, end_day: 12, ZZ: 0, YY: 2 }, { id: 14, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "陳雅慧115590": [{ id: 15, start_day: 0, end_day: 12, ZZ: 0, YY: 2 }, { id: 16, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "蔡靖雪115776": [{ id: 17, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 18, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "林怡汶109571": [{ id: 19, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 20, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "陳曉螢114167": [{ id: 21, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 22, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "陳姿芳115125": [{ id: 23, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 24, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
      "丁眉束": [{ id: 25, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 26, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }]
    }
  }),

  getters: {
    getSmallFrameRules: (state) => (employeeName) => {
      return state.smallFrame[employeeName] || []
    }
  },

  actions: {
    updateBigFrame(updates) {
      Object.assign(this.bigFrame, updates)
    },

    setMinLeaveDefault(employeeName, value) {
      this.bigFrame.min_leave_default[employeeName] = value
    },

    addSmallFrameRule(employeeName, newRule) {
      if (!this.smallFrame[employeeName]) {
        this.smallFrame[employeeName] = []
      }
      const newId = Date.now() + Math.random()
      this.smallFrame[employeeName].push({ id: newId, ...newRule })
    },

    removeSmallFrameRule(employeeName, ruleId) {
      if (this.smallFrame[employeeName]) {
        this.smallFrame[employeeName] = this.smallFrame[employeeName].filter(
          rule => rule.id !== ruleId
        )
      }
    },

    updateSmallFrameRule(employeeName, ruleId, updates) {
      if (this.smallFrame[employeeName]) {
        const rule = this.smallFrame[employeeName].find(r => r.id === ruleId)
        if (rule) {
          Object.assign(rule, updates)
        }
      }
    }
  },

  persist: {
    key: 'scheduling-flexible-hours-store',
    storage: localStorage,
  }
})
