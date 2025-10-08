import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    scheduleMonth: '2025-10',
    nonWorkingDays: ['2025-10-06', '2025-10-10'],
    externalList: [
      "林敬傑112274", "王雅婷114884", "吳巒恩112715", "陳雅慧115590",
      "蔡靖雪115776", "陳曉螢114167", "陳姿芳115125", "丁眉束"
    ],
    holidayShifts: [
      {
        employee: "陳慧陽115340",
        shift: "ED_AS",
        date: "2025-10-04"
      },
      {
        employee: "陳雅慧115590",
        shift: "ED_AS",
        date: "2025-10-11"
      },
      {
        employee: "丁眉束",
        shift: "ED_AS",
        date: "2025-10-18"
      },
      {
        employee: "丁眉束",
        shift: "EDA_AS",
        date: "2025-10-04"
      },
      {
        employee: "蔡靖雪115776",
        shift: "EDA_AS",
        date: "2025-10-11"
      },
      {
        employee: "蔡靖雪115776",
        shift: "EDA_AS",
        date: "2025-10-18"
      },
      {
        employee: "王于鳳116274",
        shift: "ED_A",
        date: "2025-10-24"
      },
      {
        employee: "林敬傑112274",
        shift: "EDA_A",
        date: "2025-10-24"
      },
      {
        employee: "陳姿芳115125",
        shift: "EDPT",
        date: "2025-10-24"
      },
      {
        employee: "吳巒恩112715",
        shift: "EDAGI",
        date: "2025-10-24"
      }
    ],
    forbiddenShifts: [{ employee: '林敬傑112274', shift: 'EDPT' }],
    priorityShifts: [
      { employee: '蔡靖雪115776', shift: 'ED_A' },
      { employee: '陳曉螢114167', shift: 'EDA_A' },
      { employee: '丁眉束', shift: 'Meta' },
      { employee: '林敬傑112274', shift: 'NEURO' },
      { employee: '陳雅慧115590', shift: 'EDGI' },
      { employee: '吳巒恩112715', shift: 'CV' },
      { employee: '陳姿芳115125', shift: 'EDPT' },
      { employee: '陳雅慧115590', shift: 'EDAGI' }
    ],
    specialRules: [
      { shift: 'LDCT+ENT', employees: ['陳慧陽115340'] },
      { shift: 'EDAPT+LDCT', employees: ['林怡汶109571'] },
      { shift: 'Uro+LDCT', employees: ['林怡汶109571'] },
      { shift: 'ENT+LDCT', employees: ['林怡汶109571'] },
      { shift: 'B16DK', employees: ['蔡芝瑜112555', '王于鳳116274'] },
      { shift: 'B16DX', employees: ['歐孟真113519'] },
    ],
    healthCheckShift: 'P.E.',
    healthCheckEligible: ['王雅婷114884', '吳巒恩112715'],
    selectedHealthCheckEmployee: '王雅婷114884'
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
