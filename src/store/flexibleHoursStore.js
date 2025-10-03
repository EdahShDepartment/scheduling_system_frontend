import { defineStore } from 'pinia'

export const useFlexibleHoursStore = defineStore('flexibleHours', {
  state: () => ({
    bigFrame: {
      start_date: "2025-10-01",
      end_date: "2025-10-25",
      min_leave_default: {
        "陳小美": 8,
        "林志明": 7,
        "張雅婷": 9,
      }
    },
    smallFrame: {
      "陳小美": [
        { id: 1, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, 
        { id: 2, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }
      ],
      "林志明": [
        { id: 3, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, 
        { id: 4, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }
      ],
      "張雅婷": [
        { id: 5, start_day: 0, end_day: 12, ZZ: 0, YY: 2 }, 
        { id: 6, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }
      ],
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
