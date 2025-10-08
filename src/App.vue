<script setup>
import { ref, shallowRef, markRaw } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';
import { useEmployeeStore } from './store/employeeStore.js';
import { useShiftStore } from './store/shiftStore.js';
import { useSettingsStore } from './store/rulesSettingsStore.js';
import { useFlexibleHoursStore } from './store/flexibleHoursStore.js';
import { useResultsStore } from './store/resultsStore.js';

// 引入頁面元件
import RulesSettingsPage from './pages/RulesSettingsPage.vue';
import ShiftManagementPage from './pages/ShiftManagementPage.vue';
import EmployeeShiftPage from './pages/EmployeeShiftPage.vue';
import FlexibleHoursPage from './pages/FlexibleHoursPage.vue';
import ResultsPage from './pages/ResultsPage.vue';

const pages = ref([
  { id: 'employee-shift', name: '員工資料設定', component: markRaw(EmployeeShiftPage), icon: 'heroicons:users' },
  { id: 'shift-management', name: '班別設定', component: markRaw(ShiftManagementPage), icon: 'heroicons:clock' },
  { id: 'rules-settings', name: '排班規則設定', component: markRaw(RulesSettingsPage), icon: 'heroicons:cog-6-tooth' },
  { id: 'flexible-hours', name: '變形工時設定', component: markRaw(FlexibleHoursPage), icon: 'heroicons:calendar-days' },
  { id: 'results', name: '排班結果', component: markRaw(ResultsPage), icon: 'heroicons:chart-bar' },
]);

// 當前顯示的頁面，預設為第一個
const currentPage = shallowRef(pages.value[0]);

// 導覽切換函式
function handleNavigation(pageId) {
  const page = pages.value.find(p => p.id === pageId);
  if (page) {
    currentPage.value = page;
  }
}

// 執行排班按鈕函式
function runScheduling() {
  const resultsStore = useResultsStore();
  resultsStore.setLoading(true);
  resultsStore.clearResults();

  const employeeStore = useEmployeeStore();
  const shiftStore = useShiftStore();
  const settingsStore = useSettingsStore();
  const flexibleHoursStore = useFlexibleHoursStore();

  // 組合所有 store 的狀態成一個 JSON 物件
  const schedulingData = {};

  // 排班年月
  schedulingData.schedule_settings = {
    year: parseInt(settingsStore.scheduleMonth.split('-')[0]),
    month: parseInt(settingsStore.scheduleMonth.split('-')[1])
  };
  // 員工名單
  schedulingData.employees = employeeStore.employees.map(emp => emp.name);
  // 可以外檢名單
  schedulingData.valid_employees_for_outpatient = settingsStore.externalList;
  // 上個月連續上班天數
  schedulingData.prev_continuous_days = employeeStore.employees.map(emp => emp.lastMonthConsecutive || 0);
  // 班別種類
  schedulingData.shifts = {};
  shiftStore.shifts.forEach(shift => {
    schedulingData.shifts[shift.name] = {
      min_staff: shift.min_staff,
      priority: shift.priority,
      avoid_on_weekend: shift.avoid_on_weekend,
      work_on_holiday: shift.work_on_holiday,
      start_time: shift.start_time,
      end_time: shift.end_time,
      priority_per_day: shift.priority_per_day
    };
  });
  // 有無駕照
  schedulingData.has_license = {};
  employeeStore.employees.forEach(emp => {
    schedulingData.has_license[emp.name] = emp.hasLicense;
  });
  // 預假日
  schedulingData.employee_leave = {};
  employeeStore.employees.forEach(emp => {
    schedulingData.employee_leave[emp.name] = emp.vacationDates;
  });
  // 變形工時小框框
  schedulingData.shift_modifications = flexibleHoursStore.smallFrame;
  // 公司規定不能上班日
  schedulingData.company_holidays = settingsStore.nonWorkingDays;
  // 指定假日班
  schedulingData.special_assignments = settingsStore.holidayShifts;
  // 變形工時大框框
  schedulingData.leave_settings = flexibleHoursStore.bigFrame;
  // 禁止某人員上班之櫃檯
  schedulingData.forbidden_assignments = settingsStore.forbiddenShifts;
  // 特殊人員排班規則
  schedulingData.special_shifts = {};
  settingsStore.specialRules.forEach(rule => {
    schedulingData.special_shifts[rule.shift] = rule.employees;
  });
  // 能上健檢的名單
  schedulingData.special_shift_rules = [
    { shift: settingsStore.healthCheckShift, allowed_employees: settingsStore.healthCheckEligible }
  ];
  // 當月輪健檢之員工
  schedulingData.bonus_shifts = settingsStore.selectedHealthCheckEmployee
    ? [{ employee: settingsStore.selectedHealthCheckEmployee, shift: settingsStore.healthCheckShift, weight: 1 }]
    : [];
  // 人員優先班別
  schedulingData.preferred_assignments = {};
  settingsStore.priorityShifts.forEach(rule => {
    if (!schedulingData.preferred_assignments[rule.shift]) {
      schedulingData.preferred_assignments[rule.shift] = [];
    }
    schedulingData.preferred_assignments[rule.shift].push(rule.employee);
  });
  // 當月健檢不輪平日外檢
  schedulingData.restricted_assignments = settingsStore.selectedHealthCheckEmployee
    ? [{ employee: settingsStore.selectedHealthCheckEmployee, shifts: "外檢", condition: "weekday" }]
    : [];

  const jsonData = JSON.stringify(schedulingData, null, 2);

  console.log('準備傳送到後端的排班資料:');
  console.log(jsonData);

  fetch('http://127.0.0.1:8000/generate_schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonData,
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP 錯誤！ 狀態: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (data.status === 'ok') {
        resultsStore.setSchedule(data.schedule);
        resultsStore.setScheduleMonth(settingsStore.scheduleMonth);
      } else {
        resultsStore.setError(data.message || '後端回傳錯誤');
      };
    })
    .catch(error => resultsStore.setError(error.message));

  // 強制切換到結果頁
  handleNavigation('results');
}
</script>

<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar -->
    <Sidebar :pages="pages" :currentPage="currentPage" @navigate="handleNavigation" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- <header class="bg-white shadow-sm">
        <div class="container mx-auto px-6 py-4">
          <h2 class="text-2xl font-bold text-gray-800">{{ currentPage.name }}</h2>
        </div>
      </header> -->

      <main class="flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <section class="flex-1 container mx-auto p-6">
          <!-- 動態載入當前頁面元件 -->
          <component :is="currentPage.component" />

          <!-- Actions -->
          <div class="mt-8 flex justify-end space-x-4">
            <!-- <button class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg">
              儲存設定
            </button> -->
            <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
              @click="runScheduling">
              執行自動排班
            </button>
          </div>
        </section>
        <Footer></Footer>
      </main>

    </div>
  </div>
</template>

<style>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  border-bottom: 1px solid #eee;
  font-size: 0.875rem;
}
</style>
