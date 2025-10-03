import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    scheduleMonth: '2025-10',
    nonWorkingDays: ['2025-10-10', '2025-10-25'],
    externalList: ['王大文']
  }),

  getters: {
    hasNonWorkingDays: (state) => state.nonWorkingDays.length > 0,
    hasExternalEmployees: (state) => state.externalList.length > 0,
    formattedNonWorkingDays: (state) => state.nonWorkingDays.join(', ') || '[無]',
    formattedExternalList: (state) => state.externalList.join(', ') || '[無]'
  },

  actions: {
    setScheduleMonth(month) {
      this.scheduleMonth = month
    },

    addNonWorkingDay(date) {
      if (date && !this.nonWorkingDays.includes(date)) {
        this.nonWorkingDays.push(date)
        this.nonWorkingDays.sort()
      }
    },

    removeNonWorkingDay(date) {
      this.nonWorkingDays = this.nonWorkingDays.filter(d => d !== date)
    },

    addExternalEmployee(name) {
      if (name && !this.externalList.includes(name)) {
        this.externalList.push(name)
      }
    },

    removeExternalEmployee(name) {
      this.externalList = this.externalList.filter(n => n !== name)
    }
  },

  persist: {
    key: 'scheduling-settings-store',
    storage: localStorage,
  }
})
