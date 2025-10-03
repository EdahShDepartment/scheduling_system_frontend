import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    scheduleMonth: '2025-10',
    nonWorkingDays: ['2025-10-10', '2025-10-25'],
    externalList: ['王大文'],
    holidayShifts: [{ employee: '陳小美', shift: 'EDPT', date: '2025-10-25' }],
    forbiddenShifts: [{ employee: '林志明', shift: 'EDA_AS' }],
    priorityShifts: [{ employee: '張雅婷', shift: 'ED_AS' }],
    specialRules: [
      { shift: 'ENT+LDCT', employees: ['陳小美'] },
      { shift: 'B16DK', employees: ['林志明', '張雅婷'] }
    ],
    healthCheckShift: 'P.E.',
    healthCheckEligible: ['陳小美', '張雅婷'],
    selectedHealthCheckEmployee: ''
  }),

  getters: {
    hasNonWorkingDays: (state) => state.nonWorkingDays.length > 0,
    hasExternalEmployees: (state) => state.externalList.length > 0,
    formattedNonWorkingDays: (state) => state.nonWorkingDays.join(', ') || '[無]',
    formattedExternalList: (state) => state.externalList.join(', ') || '[無]',
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
    },

    addHolidayShift(shift) {
      if (shift.employee && shift.shift && shift.date) {
        this.holidayShifts.push(shift)
      }
    },

    removeHolidayShift(index) {
      this.holidayShifts.splice(index, 1)
    },

    addForbiddenShift(shift) {
      if (shift.employee && shift.shift) {
        this.forbiddenShifts.push(shift)
      }
    },

    removeForbiddenShift(index) {
      this.forbiddenShifts.splice(index, 1)
    },

    addPriorityShift(shift) {
      if (shift.employee && shift.shift) {
        this.priorityShifts.push(shift)
      }
    },

    removePriorityShift(index) {
      this.priorityShifts.splice(index, 1)
    },

    addSpecialRule(rule) {
      if (rule.shift && rule.employees.length > 0) {
        this.specialRules.push(rule)
      }
    },

    removeSpecialRule(index) {
      this.specialRules.splice(index, 1)
    }
  },

  persist: {
    key: 'scheduling-settings-store',
    storage: localStorage,
  }
})
