import { defineStore } from 'pinia'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [
      {
        id: 1,
        name: '蔡芝瑜112555',
        lastMonthConsecutive: 1,
        hasLicense: false,
        vacationDates: []
      },
      {
        id: 2,
        name: '歐孟真113519',
        lastMonthConsecutive: 1,
        hasLicense: false,
        vacationDates: []
      },
      {
        id: 3,
        name: '陳慧陽115340',
        lastMonthConsecutive: 2,
        hasLicense: false,
        vacationDates: ["2025-10-25"]
      },
      {
        id: 4,
        name: '林敬傑112274',
        lastMonthConsecutive: 1,
        hasLicense: true,
        vacationDates: ["2025-10-13", "2025-10-25", "2025-10-27"]
      },
      {
        id: 5,
        name: '王雅婷114884',
        lastMonthConsecutive: 2,
        hasLicense: true,
        vacationDates: ["2025-10-05", "2025-10-11", "2025-10-18", "2025-10-23", "2025-10-26"]
      },
      {
        id: 6,
        name: '吳巒恩112715',
        lastMonthConsecutive: 1,
        hasLicense: true,
        vacationDates: []
      },
      {
        id: 7,
        name: '陳雅慧115590',
        lastMonthConsecutive: 0,
        hasLicense: false,
        vacationDates: ["2025-10-04", "2025-10-14", "2025-10-18", "2025-10-19", "2025-10-25"]
      },
      {
        id: 8,
        name: '蔡靖雪115776',
        lastMonthConsecutive: 2,
        hasLicense: false,
        vacationDates: ["2025-10-04", "2025-10-05", "2025-10-07", "2025-10-08", "2025-10-12", "2025-10-13"]
      },
      {
        id: 9,
        name: '林怡汶109571',
        lastMonthConsecutive: 1,
        hasLicense: false,
        vacationDates: ["2025-10-11"]
      },
      {
        id: 10,
        name: '陳曉螢114167',
        lastMonthConsecutive: 0,
        hasLicense: true,
        vacationDates: []
      },
      {
        id: 11,
        name: '陳姿芳115125',
        lastMonthConsecutive: 1,
        hasLicense: false,
        vacationDates: ["2025-10-29", "2025-10-30", "2025-10-31"]
      },
      {
        id: 12,
        name: '丁眉束',
        lastMonthConsecutive: 2,
        hasLicense: true,
        vacationDates: []
      },
      {
        id: 13,
        name: '王于鳳116274',
        lastMonthConsecutive: 1,
        hasLicense: false,
        vacationDates: []
      },
    ]
  }),

  getters: {
    getEmployeeById: (state) => (id) => {
      return state.employees.find(e => e.id === id)
    },
    getEmployeeByName: (state) => (name) => {
      return state.employees.find(e => e.name === name)
    },
    employeeNames: (state) => {
      return state.employees.map(e => e.name)
    }
  },

  actions: {
    addEmployee(name) {
      if (name && !this.employees.some(e => e.name === name)) {
        const newId = this.employees.length > 0
          ? Math.max(...this.employees.map(e => e.id)) + 1
          : 1
        this.employees.push({
          id: newId,
          name: name,
          lastMonthConsecutive: 0,
          hasLicense: false,
          vacationDates: [],
        })
      }
    },

    removeEmployee(employeeId) {
      this.employees = this.employees.filter(e => e.id !== employeeId)
    },

    updateEmployee(employeeId, updates) {
      const employee = this.employees.find(e => e.id === employeeId)
      if (employee) {
        Object.assign(employee, updates)
      }
    },

    addVacationDate(employeeId, date) {
      const employee = this.employees.find(e => e.id === employeeId)
      if (employee && !employee.vacationDates.includes(date)) {
        employee.vacationDates.push(date)
        employee.vacationDates.sort()
      }
    },

    removeVacationDate(employeeId, date) {
      const employee = this.employees.find(e => e.id === employeeId)
      if (employee) {
        employee.vacationDates = employee.vacationDates.filter(d => d !== date)
      }
    }
  },

  persist: {
    key: 'scheduling-employee-store',
    storage: localStorage,
  }
})
