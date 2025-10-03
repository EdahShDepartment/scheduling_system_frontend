<script setup>
import { ref, shallowRef, markRaw } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';

// 引入頁面元件
import RulesSettingsPage from './pages/RulesSettingsPage.vue';
import ShiftManagementPage from './pages/ShiftManagementPage.vue';
import EmployeeShiftPage from './pages/EmployeeShiftPage.vue';
import FlexibleHoursPage from './pages/FlexibleHoursPage.vue';
import ResultsPage from './pages/ResultsPage.vue';

// 頁面設定
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
  // 強制切換到結果頁
  handleNavigation('results');
  // 在這裡可以加入呼叫後端 API 進行排班的邏輯
  console.log('開始執行自動排班...');
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
