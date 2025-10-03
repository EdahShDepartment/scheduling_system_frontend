<script setup>
import { ref } from 'vue'
import { useEmployeeStore } from '../store/employeeStore.js'
import { useSettingsStore } from '../store/settingsStore.js'

const employeeStore = useEmployeeStore()
const settingsStore = useSettingsStore()

const newNonWorkingDay = ref('')
const selectedExternalEmployee = ref('')

function addNonWorkingDay() {
  if (newNonWorkingDay.value) {
    settingsStore.addNonWorkingDay(newNonWorkingDay.value)
    newNonWorkingDay.value = ''
  }
}

function removeNonWorkingDay(dateToRemove) {
  settingsStore.removeNonWorkingDay(dateToRemove)
}

function addExternalEmployee() {
  if (selectedExternalEmployee.value) {
    settingsStore.addExternalEmployee(selectedExternalEmployee.value)
    selectedExternalEmployee.value = ''
  }
}

function removeExternalEmployee(nameToRemove) {
  settingsStore.removeExternalEmployee(nameToRemove)
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4 border-b pb-2">主要排班設定</h3>
      <div class="space-y-4">
        <div>
          <label for="scheduleMonth" class="block text-sm font-medium text-gray-700">▪ 排班年月</label>
          <input type="month" id="scheduleMonth" v-model="settingsStore.scheduleMonth"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
        </div>

        <div>
          <label for="newNonWorkingDay" class="block text-sm font-medium text-gray-700">▪ 公司規定不上班日</label>
          <div class="mt-1 flex items-center space-x-2">
            <input type="date" id="newNonWorkingDay" v-model="newNonWorkingDay"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
            <button @click="addNonWorkingDay"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm whitespace-nowrap">加入日期</button>
          </div>
          <div v-if="settingsStore.hasNonWorkingDays" class="mt-3 space-y-2">
            <div class="flex flex-wrap gap-2">
              <div v-for="date in settingsStore.nonWorkingDays" :key="date"
                class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                <span>{{ date }}</span>
                <button @click="removeNonWorkingDay(date)"
                  class="ml-2 text-gray-500 hover:text-red-600 font-bold text-lg leading-none">&times;</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label for="externalEmployee" class="block text-sm font-medium text-gray-700">▪ 外檢名單</label>
          <div class="mt-1 flex items-center space-x-2">
            <select v-model="selectedExternalEmployee"
              class="block w-full rounded-md border-gray-300 shadow-sm p-2">
              <option disabled value="">請選擇員工加入列表</option>
              <option v-for="employee in employeeStore.employees" :key="employee.id"
                :value="employee.name">{{ employee.name }}</option>
            </select>
            <button @click="addExternalEmployee"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm whitespace-nowrap">加入</button>
          </div>
          <div v-if="settingsStore.hasExternalEmployees" class="mt-3">
            <div class="flex flex-wrap gap-2">
              <div v-for="name in settingsStore.externalList" :key="name"
                class="flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm font-medium text-blue-800">
                <span>{{ name }}</span>
                <button @click="removeExternalEmployee(name)"
                  class="ml-2 text-blue-500 hover:text-red-600 font-bold text-lg leading-none">&times;</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4 border-b pb-2">排班預覽</h3>
      <div class="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm text-gray-700">
        <p><span class="font-semibold">排班月份：</span> {{ settingsStore.scheduleMonth || '[尚未選擇]' }}</p>
        <p><span class="font-semibold">規定假日：</span> {{ settingsStore.formattedNonWorkingDays }}</p>
        <p><span class="font-semibold">外檢名單：</span> {{ settingsStore.formattedExternalList }}</p>
      </div>
    </div>
  </div>
</template>
