<script setup>
import { ref, watch } from 'vue'
import { useEmployeeStore } from '../store/employeeStore.js'
import { useSettingsStore } from '../store/rulesSettingsStore.js'
import { useFlexibleHoursStore } from '../store/flexibleHoursStore.js'

const employeeStore = useEmployeeStore()
const settingsStore = useSettingsStore()
const flexibleHoursStore = useFlexibleHoursStore()
const newEmployeeName = ref('')

const add = () => {
  if (newEmployeeName.value) {
    employeeStore.addEmployee(newEmployeeName.value)
    newEmployeeName.value = ''
  }
}

const remove = (employeeId) => {
  if (confirm('確定要刪除這位員工嗎？')) {
    employeeStore.removeEmployee(employeeId)
  }
}

const isVacationModalOpen = ref(false)
const currentlyEditingEmployee = ref(null)
const newVacationDate = ref('')

const openVacationModal = (employee) => {
  currentlyEditingEmployee.value = employee
  isVacationModalOpen.value = true
}

const closeVacationModal = () => {
  isVacationModalOpen.value = false
  currentlyEditingEmployee.value = null
  newVacationDate.value = ''
}

const addVacationDate = () => {
  if (newVacationDate.value && currentlyEditingEmployee.value) {
    employeeStore.addVacationDate(currentlyEditingEmployee.value.id, newVacationDate.value)
    newVacationDate.value = ''
  }
}

const removeVacationDate = (dateToRemove) => {
  if (currentlyEditingEmployee.value) {
    employeeStore.removeVacationDate(currentlyEditingEmployee.value.id, dateToRemove)
  }
}

watch(
  () => employeeStore.employees,
  (employees) => {
    // 取得現有員工姓名集合
    const employeeNames = employees.map(emp => emp.name)
    // 過濾掉已不存在的員工
    settingsStore.healthCheckEligible = settingsStore.healthCheckEligible.filter(name =>
      employeeNames.includes(name)
    )
    settingsStore.externalList = settingsStore.externalList.filter(name =>
      employeeNames.includes(name)
    )

    // 檢查指定假日班
    if (settingsStore.holidayShifts) {
      settingsStore.holidayShifts = settingsStore.holidayShifts.filter(shift =>
        employeeNames.includes(shift.employee)
      )
    }
    // 檢查禁止某人員上班之班別
    if (settingsStore.forbiddenShifts) {
      settingsStore.forbiddenShifts = settingsStore.forbiddenShifts.filter(shift =>
        employeeNames.includes(shift.employee)
      )
    }
    // 檢查優先排班之班別
    if (settingsStore.priorityShifts) {
      settingsStore.priorityShifts = settingsStore.priorityShifts.filter(shift =>
        employeeNames.includes(shift.employee)
      )
    }
    // 檢查特殊人員排班規則
    if (settingsStore.specialRules) {
      const newSpecialRules = []
      settingsStore.specialRules.forEach(rule => {
        const filteredEmployees = rule.employees.filter(employee =>
          employeeNames.includes(employee)
        )
        if (filteredEmployees.length > 0) {
          newSpecialRules.push({ shift: rule.shift, employees: filteredEmployees })
        }
      })
      settingsStore.specialRules = newSpecialRules
    }
    // 檢查當月輪健檢之員工
    if (
      settingsStore.selectedHealthCheckEmployee &&
      !employeeNames.includes(settingsStore.selectedHealthCheckEmployee)
    ) {
      settingsStore.selectedHealthCheckEmployee = ''
    }
    // 檢查大框設定
    Object.keys(flexibleHoursStore.bigFrame.min_leave_default).forEach(name => {
      if (!employeeNames.includes(name)) {
        delete flexibleHoursStore.bigFrame.min_leave_default[name]
      }
    })
    // 檢查小框設定
    Object.keys(flexibleHoursStore.smallFrame).forEach(name => {
      if (!employeeNames.includes(name)) {
        delete flexibleHoursStore.smallFrame[name]
      }
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4 border-b pb-2">員工資訊</h3>

      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 class="font-medium text-gray-800 mb-2">新增員工</h4>
        <div class="flex items-center space-x-2">
          <input type="text" v-model.trim="newEmployeeName" @keyup.enter="add" placeholder="輸入新員工姓名"
            class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
          <button @click="add"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm whitespace-nowrap">
            新增
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full leading-normal text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">姓名</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">上月連上</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">駕照</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">預假日</th>
              <th class="px-3 py-2 text-center font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody v-if="employeeStore.employees.length > 0">
            <tr v-for="employee in employeeStore.employees" :key="employee.id" class="border-b hover:bg-gray-50">
              <td class="px-3 py-2 font-medium text-gray-800">{{ employee.name }}</td>
              <td class="px-3 py-2">
                <input type="number" v-model="employee.lastMonthConsecutive" min="0" max="6"
                  class="w-20 p-1 border rounded-md">
              </td>
              <td class="px-3 py-2">
                <input type="checkbox" v-model="employee.hasLicense" class="h-4 w-4 rounded text-indigo-600">
              </td>
              <td class="px-3 py-2">
                <span class="text-gray-700">{{ employee.vacationDates.length }} 天</span>
                <button @click="openVacationModal(employee)"
                  class="ml-2 text-indigo-600 hover:text-indigo-800 text-xs font-bold underline">編輯</button>
              </td>
              <td class="px-3 py-2 text-center">
                <button @click="remove(employee.id)" class="text-red-500 hover:text-red-700 font-bold">
                  移除
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center py-4 text-gray-500">尚未建立任何員工資料。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="isVacationModalOpen"
    class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
    <div class="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg leading-6 font-medium text-gray-900 text-center mb-4">
          編輯 {{ currentlyEditingEmployee.name }} 的預假日
        </h3>
        <div class="mt-4 px-2 py-3">
          <div class="flex items-center space-x-2">
            <input type="date" v-model="newVacationDate" class="block w-full rounded-md border-gray-300 shadow-sm p-2">
            <button @click="addVacationDate"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 whitespace-nowrap">加入</button>
          </div>
          <div v-if="currentlyEditingEmployee.vacationDates.length > 0"
            class="mt-4 max-h-48 overflow-y-auto border rounded-md p-2">
            <div v-for="date in currentlyEditingEmployee.vacationDates" :key="date"
              class="flex justify-between items-center bg-gray-100 p-2 rounded mt-1">
              <span class="text-sm font-medium text-gray-700">{{ date }}</span>
              <button @click="removeVacationDate(date)"
                class="text-red-500 hover:text-red-700 font-bold text-xl leading-none">&times;</button>
            </div>
          </div>
          <p v-else class="mt-4 text-sm text-center text-gray-500">尚無預排假日。</p>
        </div>
        <div class="items-center px-4 py-3 mt-2">
          <button @click="closeVacationModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 w-full">
            完成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
