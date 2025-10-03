<script setup>
import { ref, reactive, watch } from 'vue'
import { useEmployeeStore } from '../store/employeeStore.js'
import { useSettingsStore } from '../store/rulesSettingsStore.js'
import { useShiftStore } from '../store/shiftStore.js'

const employeeStore = useEmployeeStore()
const settingsStore = useSettingsStore()
const shiftStore = useShiftStore()

// 主要排班設定
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

// 特殊規則設定
const newHolidayShift = reactive({ employee: '', shift: '', date: '' })
const newForbiddenShift = reactive({ employee: '', shift: '' })
const newPriorityShift = reactive({ employee: '', shift: '' })
const newSpecialRule = reactive({
  shift: '',
  employees: []
})

function addHolidayShift() {
  if (newHolidayShift.employee && newHolidayShift.shift && newHolidayShift.date) {
    settingsStore.addHolidayShift({ ...newHolidayShift })
    Object.assign(newHolidayShift, { employee: '', shift: '', date: '' })
  }
}

function removeHolidayShift(index) {
  settingsStore.removeHolidayShift(index)
}

function addForbiddenShift() {
  if (newForbiddenShift.employee && newForbiddenShift.shift) {
    settingsStore.addForbiddenShift({ ...newForbiddenShift })
    Object.assign(newForbiddenShift, { employee: '', shift: '' })
  }
}

function removeForbiddenShift(index) {
  settingsStore.removeForbiddenShift(index)
}

function addPriorityShift() {
  if (newPriorityShift.employee && newPriorityShift.shift) {
    settingsStore.addPriorityShift({ ...newPriorityShift })
    Object.assign(newPriorityShift, { employee: '', shift: '' })
  }
}

function removePriorityShift(index) {
  settingsStore.removePriorityShift(index)
}

function addSpecialRule() {
  if (newSpecialRule.shift && newSpecialRule.employees.length > 0) {
    const existingRule = settingsStore.specialRules.find(r => r.shift === newSpecialRule.shift)
    if (existingRule) {
      const existingEmployeeNames = new Set(existingRule.employees)
      const newEmployeeNames = new Set(newSpecialRule.employees)
      newSpecialRule.employees = [...existingEmployeeNames, ...newEmployeeNames]
    } else {
      settingsStore.addSpecialRule({ ...newSpecialRule })
      Object.assign(newSpecialRule, { shift: '', employees: [] })
    }
  }
}

function removeSpecialRule(index) {
  settingsStore.removeSpecialRule(index)
}

watch(
  () => settingsStore.healthCheckEligible,
  (eligibleList) => {
    if (
      settingsStore.selectedHealthCheckEmployee &&
      !eligibleList.includes(settingsStore.selectedHealthCheckEmployee)
    ) {
      settingsStore.selectedHealthCheckEmployee = ''
    }
  }
)
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
            <select v-model="selectedExternalEmployee" class="block w-full rounded-md border-gray-300 shadow-sm p-2">
              <option hidden disabled value="">請選擇員工加入列表</option>
              <option v-for="employee in employeeStore.employees" :key="employee.id" :value="employee.name">{{
                employee.name }}</option>
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

    <!-- 新增特殊規則設定區塊 -->
    <div class="bg-white p-6 rounded-lg shadow-md flex flex-col gap-y-6">
      <h3 class="text-xl font-semibold mb-2 border-b pb-3">特殊規則設定</h3>
      <!-- 指定假日班 -->
      <div>
        <h4 class="font-medium text-sm text-gray-800 mb-2">▪ 指定假日班</h4>
        <div v-for="(item, index) in settingsStore.holidayShifts" :key="index" class="list-item">
          <p class="text-gray-700">
            <span>{{ item.employee }} / {{ item.shift }} / {{ item.date }}</span>
          </p>
          <button @click="removeHolidayShift(index)"
            class="text-red-500 hover:text-red-700 text-xs font-bold">移除</button>
        </div>
        <div class="input-group mt-2">
          <select v-model="newHolidayShift.employee" class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
            <option hidden disabled value="">選擇員工</option>
            <option v-for="emp in employeeStore.employees" :key="emp.id" :value="emp.name">{{ emp.name }}
            </option>
          </select>
          <select v-model="newHolidayShift.shift" class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
            <option hidden disabled value="">選擇班別</option>
            <option v-for="shift in shiftStore.shiftNames" :key="shift" :value="shift">{{ shift }}
            </option>
          </select>
          <input type="date" v-model="newHolidayShift.date"
            class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
          <button @click="addHolidayShift"
            class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap">新增</button>
        </div>
      </div>

      <!-- 禁止某人員上班之班別 -->
      <div>
        <h4 class="font-medium text-sm text-gray-800 mb-2">▪ 禁止某人員上班之班別</h4>
        <div v-for="(item, index) in settingsStore.forbiddenShifts" :key="index" class="list-item">
          <p class="text-gray-700">
            <span>{{ item.employee }} / {{ item.shift }}</span>
          </p>
          <button @click="removeForbiddenShift(index)"
            class="text-red-500 hover:text-red-700 text-xs font-bold">移除</button>
        </div>
        <div class="input-group mt-2">
          <select v-model="newForbiddenShift.employee" class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
            <option hidden disabled value="">選擇員工</option>
            <option v-for="emp in employeeStore.employees" :key="emp.id" :value="emp.name">{{ emp.name }}
            </option>
          </select>
          <select v-model="newForbiddenShift.shift" class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
            <option hidden disabled value="">選擇班別</option>
            <option v-for="shift in shiftStore.shiftNames" :key="shift" :value="shift">{{ shift }}
            </option>
          </select>
          <button @click="addForbiddenShift" class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm">新增</button>
        </div>
      </div>

      <!-- 人員優先班別 -->
      <div>
        <h4 class="font-medium text-sm text-gray-800 mb-2">▪ 人員優先班別</h4>
        <div v-for="(item, index) in settingsStore.priorityShifts" :key="index" class="list-item">
          <p class="text-gray-700">
            <span>{{ item.employee }} / {{ item.shift }}</span>
          </p>
          <button @click="removePriorityShift(index)"
            class="text-red-500 hover:text-red-700 text-xs font-bold">移除</button>
        </div>
        <div class="input-group mt-2">
          <select v-model="newPriorityShift.employee" class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
            <option hidden disabled value="">選擇員工</option>
            <option v-for="emp in employeeStore.employees" :key="emp.id" :value="emp.name">{{ emp.name }}
            </option>
          </select>
          <select v-model="newPriorityShift.shift" class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
            <option hidden disabled value="">選擇班別</option>
            <option v-for="shift in shiftStore.shiftNames" :key="shift" :value="shift">{{ shift }}
            </option>
          </select>
          <button @click="addPriorityShift" class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm">新增</button>
        </div>
      </div>

      <!-- 特殊人員排班規則 -->
      <div>
        <h4 class="font-medium text-sm text-gray-800 mb-2">▪ 特殊人員排班規則</h4>
        <div v-for="(rule, index) in settingsStore.specialRules" :key="index" class="list-item">
          <p class="text-gray-700 flex-1">
            <span class="font-semibold">{{ rule.shift }}:</span>
            <span class="text-xs ml-2">{{ rule.employees.join(', ') }}</span>
          </p>
          <button @click="removeSpecialRule(index)"
            class="text-red-500 hover:text-red-700 text-xs font-bold">移除</button>
        </div>
        <div class="p-4 mt-2 border-t bg-gray-50 rounded-b-lg">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">選擇班別</label>
              <select v-model="newSpecialRule.shift" class="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm">
                <option hidden disabled value="">請選擇班別</option>
                <option v-for="shift in shiftStore.shiftNames" :key="shift" :value="shift">{{ shift }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">選擇對應員工 (可多選)</label>
              <div class="mt-1 max-h-32 overflow-y-auto border rounded-md p-2 space-y-1 bg-white">
                <div v-for="emp in employeeStore.employees" :key="emp.id">
                  <label class="inline-flex items-center w-full cursor-pointer p-1 rounded hover:bg-gray-100">
                    <input type="checkbox" :value="emp.name" v-model="newSpecialRule.employees"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm">
                    <span class="ml-2 text-sm text-gray-700">{{ emp.name }}</span>
                  </label>
                </div>
              </div>
            </div>
            <button @click="addSpecialRule"
              class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap w-full hover:bg-blue-600">新增規則</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 健檢相關設定 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4 border-b pb-2">健檢相關設定</h3>
      <div class="space-y-6">
        <!-- 健檢班別選擇 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">▪ 健檢班別</label>
          <select v-model="settingsStore.healthCheckShift"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
            <option hidden disabled value="">請選擇班別</option>
            <option v-for="shift in shiftStore.shiftNames" :key="shift" :value="shift">{{ shift }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">▪ 能上健檢的名單</label>
          <div class="mt-2 max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
            <div v-for="emp in employeeStore.employees" :key="emp.id">
              <label class="inline-flex items-center">
                <input type="checkbox" :value="emp.name" v-model="settingsStore.healthCheckEligible"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm">
                <span class="ml-2 text-sm text-gray-700">{{ emp.name }}</span>
              </label>
            </div>
          </div>
        </div>
        <div>
          <label for="healthCheckEmployee" class="block text-sm font-medium text-gray-700">▪ 當月輪健檢之員工</label>
          <select id="healthCheckEmployee" v-model="settingsStore.selectedHealthCheckEmployee"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
            <option hidden disabled value="">請從符合資格者中選擇</option>
            <option v-for="employeeName in settingsStore.healthCheckEligible" :key="employeeName" :value="employeeName">
              {{ employeeName }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  border-bottom: 1px solid #eee;
  font-size: 0.875rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
