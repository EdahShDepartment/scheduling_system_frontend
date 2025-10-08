<script setup>
import { reactive, watch, ref } from 'vue'
import { useShiftStore } from '../store/shiftStore.js'
import { useSettingsStore } from '../store/rulesSettingsStore.js'

const settingsStore = useSettingsStore()
const shiftStore = useShiftStore()

const newShiftDefaults = {
  name: "",
  min_staff: 1,
  priority: 1,
  avoid_on_weekend: false,
  work_on_holiday: false,
  start_time: "09:00",
  end_time: "18:00",
  priority_per_day: {},
}

const newShift = reactive({ ...newShiftDefaults })

const add = () => {
  shiftStore.addShift({ ...newShift })
  Object.assign(newShift, newShiftDefaults)
}

const remove = (shiftId) => {
  if (confirm('確定要刪除這個班別嗎？')) {
    shiftStore.removeShift(shiftId)
  }
}

// Modal state for priority_per_day
const isPriorityModalOpen = ref(false)
const currentlyEditingShift = ref(null)
const newPriorityRule = reactive({ day: '', date: '', priority: 0, type: 'weekday' })
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const openPriorityModal = (shift) => {
  currentlyEditingShift.value = shift
  if (!shift.priority_per_day) {
    shift.priority_per_day = {}
  }
  isPriorityModalOpen.value = true
}

const closePriorityModal = () => {
  isPriorityModalOpen.value = false
  currentlyEditingShift.value = null
  Object.assign(newPriorityRule, { day: '', date: '', priority: 0, type: 'weekday' })
}

const addPriorityRule = () => {
  if (currentlyEditingShift.value) {
    const key = newPriorityRule.type === 'weekday' ? newPriorityRule.day : newPriorityRule.date
    if (key) {
      currentlyEditingShift.value.priority_per_day[key] = newPriorityRule.priority
      newPriorityRule.day = ''
      newPriorityRule.date = ''
      newPriorityRule.priority = 0
    }
  }
}

const removePriorityRule = (dayToRemove) => {
  if (currentlyEditingShift.value) {
    delete currentlyEditingShift.value.priority_per_day[dayToRemove]
  }
}

watch(
  () => shiftStore.shifts,
  (shifts) => {
    const shiftNames = shifts.map(shift => shift.name)
    // 檢查指定假日班
    if (settingsStore.holidayShifts) {
      settingsStore.holidayShifts = settingsStore.holidayShifts.filter(rule =>
        shiftNames.includes(rule.shift)
      )
    }
    // 檢查禁止某人員上班之班別
    if (settingsStore.forbiddenShifts) {
      settingsStore.forbiddenShifts = settingsStore.forbiddenShifts.filter(rule =>
        shiftNames.includes(rule.shift)
      )
    }
    // 檢查優先排班之班別
    if (settingsStore.priorityShifts) {
      settingsStore.priorityShifts = settingsStore.priorityShifts.filter(rule =>
        shiftNames.includes(rule.shift)
      )
    }
    // 檢查特殊人員排班規則
    if (settingsStore.specialRules) {
      settingsStore.specialRules = settingsStore.specialRules.filter(rule =>
        shiftNames.includes(rule.shift)
      )
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4 border-b pb-2">班別列表</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full leading-normal text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">班別名稱</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">最少人力</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">優先級</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">開始時間</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600">結束時間</th>
              <th class="px-3 py-2 text-center font-semibold text-gray-600">週末不上班</th>
              <th class="px-3 py-2 text-center font-semibold text-gray-600">國定假日上班</th>
              <th class="px-3 py-2 text-center font-semibold text-gray-600">每日優先級</th>
              <th class="px-3 py-2 text-center font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody v-if="shiftStore.shifts.length > 0">
            <tr v-for="shift in shiftStore.shifts" :key="shift.id" class="border-b hover:bg-gray-50">
              <td class="px-3 py-2"><input type="text" v-model="shift.name" class="w-24 p-1 border rounded-md"></td>
              <td class="px-3 py-2"><input type="number" v-model.number="shift.min_staff" min="0"
                  class="w-16 p-1 border rounded-md"></td>
              <td class="px-3 py-2"><input type="number" v-model.number="shift.priority" min="0"
                  class="w-16 p-1 border rounded-md"></td>
              <td class="px-3 py-2"><input type="time" v-model="shift.start_time" class="p-1 border rounded-md"></td>
              <td class="px-3 py-2"><input type="time" v-model="shift.end_time" class="p-1 border rounded-md"></td>
              <td class="px-3 py-2 text-center"><input type="checkbox" v-model="shift.avoid_on_weekend"
                  class="h-4 w-4 rounded text-indigo-600"></td>
              <td class="px-3 py-2 text-center"><input type="checkbox" v-model="shift.work_on_holiday"
                  class="h-4 w-4 rounded text-indigo-600"></td>
              <td class="px-3 py-2 text-center">
                <span class="text-gray-700">{{ Object.keys(shift.priority_per_day || {}).length }} 條</span>
                <button @click="openPriorityModal(shift)"
                  class="ml-2 text-indigo-600 hover:text-indigo-800 text-xs font-bold underline">編輯</button>
              </td>
              <td class="px-3 py-2 text-center">
                <button @click="remove(shift.id)" class="text-red-500 hover:text-red-700 font-bold">移除</button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="9" class="text-center py-4 text-gray-500">尚未建立任何班別。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4 border-b pb-2">新增班別</h3>
      <form @submit.prevent="add" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">班別名稱</label>
          <input type="text" v-model="newShift.name" required placeholder="請輸入班別"
            class="w-full p-2 border rounded-md text-sm">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">最少人力</label>
          <input type="number" v-model.number="newShift.min_staff" min="0" required
            class="w-full p-2 border rounded-md text-sm">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">優先級</label>
          <input type="number" v-model.number="newShift.priority" min="0" required
            class="w-full p-2 border rounded-md text-sm">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">開始時間</label>
          <input type="time" v-model="newShift.start_time" required class="w-full p-2 border rounded-md text-sm">
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">結束時間</label>
          <input type="time" v-model="newShift.end_time" required class="w-full p-2 border rounded-md text-sm">
        </div>
        <div class="flex items-center gap-4 col-span-1 md:col-span-2">
          <label class="flex items-center">
            <input type="checkbox" v-model="newShift.avoid_on_weekend" class="h-4 w-4 rounded text-indigo-600">
            <span class="ml-2 text-sm text-gray-700">週末不上班</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="newShift.work_on_holiday" class="h-4 w-4 rounded text-indigo-600">
            <span class="ml-2 text-sm text-gray-700">國定假日上班</span>
          </label>
        </div>
        <div class="lg:col-start-4">
          <button type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full">新增班別</button>
        </div>
      </form>
    </div>

    <!-- Priority Per Day Modal -->
    <div v-if="isPriorityModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg leading-6 font-medium text-gray-900 text-center mb-4">
            編輯 {{ currentlyEditingShift.name }} 的每日優先級
          </h3>
          <div class="mt-4 px-2 py-3">
            <div class="flex items-center space-x-4 mb-4 border-b pb-3">
              <label class="flex items-center">
                <input type="radio" v-model="newPriorityRule.type" value="weekday" class="h-4 w-4 text-indigo-600">
                <span class="ml-2 text-sm text-gray-700">依星期</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="newPriorityRule.type" value="date" class="h-4 w-4 text-indigo-600">
                <span class="ml-2 text-sm text-gray-700">依日期</span>
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <select v-if="newPriorityRule.type === 'weekday'" v-model="newPriorityRule.day"
                class="block w-full rounded-md border-gray-300 shadow-sm p-2">
                <option value="" hidden disabled>選擇星期</option>
                <option v-for="day in weekdays" :key="day" :value="day">{{ day }}</option>
              </select>
              <input v-else type="date" v-model="newPriorityRule.date"
                class="block w-full rounded-md border-gray-300 shadow-sm p-2">
              <input type="number" v-model.number="newPriorityRule.priority" min="0" max="3"
                class="block w-32 rounded-md border-gray-300 shadow-sm p-2" placeholder="優先級(0-3)">
              <button @click="addPriorityRule"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 whitespace-nowrap">加入</button>
            </div>
            <div v-if="Object.keys(currentlyEditingShift.priority_per_day).length > 0"
              class="mt-4 max-h-48 overflow-y-auto border rounded-md p-2">
              <div v-for="(priority, day) in currentlyEditingShift.priority_per_day" :key="day"
                class="flex justify-between items-center bg-gray-100 p-2 rounded mt-1">
                <span class="text-sm font-medium text-gray-700">{{ day }}: {{ priority }}</span>
                <button @click="removePriorityRule(day)"
                  class="text-red-500 hover:text-red-700 font-bold text-xl leading-none">&times;</button>
              </div>
            </div>
            <p v-else class="mt-4 text-sm text-center text-gray-500">尚無每日優先級規則。</p>
          </div>
          <div class="items-center px-4 py-3 mt-2">
            <button @click="closePriorityModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 w-full">
              完成
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
