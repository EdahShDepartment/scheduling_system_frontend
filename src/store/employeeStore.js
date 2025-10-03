import { defineStore } from 'pinia'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [
      { 
        id: 1, 
        name: '陳小美', 
        lastMonthConsecutive: 2, 
        hasLicense: true, 
        vacationDates: ['2025-10-10', '2025-10-25'] 
      },
      { 
        id: 2, 
        name: '林志明', 
        lastMonthConsecutive: 0, 
        hasLicense: false, 
        vacationDates: ['2025-10-15'] 
      },
      { 
        id: 3, 
        name: '張雅婷', 
        lastMonthConsecutive: 4, 
        hasLicense: true, 
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
