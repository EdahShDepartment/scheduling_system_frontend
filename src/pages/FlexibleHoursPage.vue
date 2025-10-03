<script setup>
import { ref, reactive, watch } from 'vue';
import { employeeStore } from '../store/employeeStore.js';
import { flexibleHoursStore } from '../store/flexibleHoursStore.js';

const selectedEmployee = ref('');

const newRuleDefaults = { start_day: 0, end_day: 0, ZZ: 0, YY: 0 };
const newRule = reactive({ ...newRuleDefaults });

// 當員工列表更新時，初始化他們在 min_leave_default 中的值
watch(() => employeeStore.employees, (newEmployees) => {
    newEmployees.forEach(emp => {
        if (flexibleHoursStore.bigFrame.min_leave_default[emp.name] === undefined) {
            flexibleHoursStore.bigFrame.min_leave_default[emp.name] = 8; // 給予一個預設值
        }
    });
}, { immediate: true, deep: true });

const addRule = () => {
    if (selectedEmployee.value) {
        flexibleHoursStore.addSmallFrameRule(selectedEmployee.value, newRule);
        Object.assign(newRule, newRuleDefaults); // 重設表單
    }
};

const removeRule = (ruleId) => {
    if (selectedEmployee.value && confirm('確定要刪除這條規則嗎?')) {
        flexibleHoursStore.removeSmallFrameRule(selectedEmployee.value, ruleId);
    }
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <!-- 上方編輯區 -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <!-- 左側: 大框設定 -->
            <div class="lg:col-span-2 flex flex-col gap-6">
                <div class="bg-white p-6 rounded-lg shadow-md h-full">
                    <h3 class="text-xl font-semibold mb-4 border-b pb-2">大框設定</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">開始日期</label>
                            <input type="date" v-model="flexibleHoursStore.bigFrame.start_date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">結束日期</label>
                            <input type="date" v-model="flexibleHoursStore.bigFrame.end_date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-700 mt-4">預設最少休假天數</h4>
                            <div class="mt-2 space-y-2">
                                <div v-for="employee in employeeStore.employees" :key="employee.id"
                                    class="flex items-center justify-between">
                                    <span class="text-gray-800">{{ employee.name }}</span>
                                    <input type="number"
                                        v-model.number="flexibleHoursStore.bigFrame.min_leave_default[employee.name]"
                                        min="0" class="w-24 p-1 border rounded-md text-sm">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右側: 小框設定 -->
            <div class="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4 border-b pb-2">小框設定</h3>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">請選擇要設定的員工</label>
                    <select v-model="selectedEmployee"
                        class="block w-full rounded-md border-gray-300 shadow-sm p-2 mb-4">
                        <option disabled value="">選擇員工</option>
                        <option v-for="employee in employeeStore.employees" :key="employee.id" :value="employee.name">
                            {{ employee.name }}</option>
                    </select>
                </div>

                <div v-if="selectedEmployee">
                    <!-- 規則列表 -->
                    <div class="mb-4">
                        <h4 class="font-semibold text-gray-800 mb-2">{{ selectedEmployee }} 的規則</h4>
                        <table class="min-w-full leading-normal text-sm"
                            v-if="flexibleHoursStore.smallFrame[selectedEmployee]?.length">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-2 py-2 text-left font-medium text-gray-600">開始日</th>
                                    <th class="px-2 py-2 text-left font-medium text-gray-600">結束日</th>
                                    <th class="px-2 py-2 text-left font-medium text-gray-600">ZZ</th>
                                    <th class="px-2 py-2 text-left font-medium text-gray-600">YY</th>
                                    <th class="px-2 py-2 text-center font-medium text-gray-600">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="rule in flexibleHoursStore.smallFrame[selectedEmployee]" :key="rule.id">
                                    <td class="px-2 py-1"><input type="number" v-model.number="rule.start_day"
                                            class="w-16 p-1 border rounded-md"></td>
                                    <td class="px-2 py-1"><input type="number" v-model.number="rule.end_day"
                                            class="w-16 p-1 border rounded-md"></td>
                                    <td class="px-2 py-1"><input type="number" v-model.number="rule.ZZ"
                                            class="w-16 p-1 border rounded-md"></td>
                                    <td class="px-2 py-1"><input type="number" v-model.number="rule.YY"
                                            class="w-16 p-1 border rounded-md"></td>
                                    <td class="px-2 py-1 text-center">
                                        <button @click="removeRule(rule.id)"
                                            class="text-red-500 hover:text-red-700">移除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-else class="text-center text-gray-500 py-4">尚無規則</p>
                    </div>
                    <!-- 新增規則 -->
                    <form @submit.prevent="addRule" class="p-4 border-t bg-gray-50 rounded-b-lg">
                        <h4 class="font-medium text-sm text-gray-800 mb-2">新增規則</h4>
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                            <div class="col-span-2 md:col-span-1"><label
                                    class="block text-xs text-gray-600">開始日</label><input type="number"
                                    v-model.number="newRule.start_day" required class="w-full p-1 border rounded-md">
                            </div>
                            <div class="col-span-2 md:col-span-1"><label
                                    class="block text-xs text-gray-600">結束日</label><input type="number"
                                    v-model.number="newRule.end_day" required class="w-full p-1 border rounded-md">
                            </div>
                            <div class="col-span-1"><label class="block text-xs text-gray-600">ZZ</label><input
                                    type="number" v-model.number="newRule.ZZ" required
                                    class="w-full p-1 border rounded-md"></div>
                            <div class="col-span-1"><label class="block text-xs text-gray-600">YY</label><input
                                    type="number" v-model.number="newRule.YY" required
                                    class="w-full p-1 border rounded-md"></div>
                            <button type="submit"
                                class="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 col-span-2 md:col-span-1">新增</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- 新增: 設定總覽 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">設定總覽</h3>
            <div class="space-y-6">
                <!-- 大框總覽 -->
                <div class="p-4 bg-gray-50 rounded-lg">
                    <p class="font-semibold text-gray-800">
                        大框期間:
                        <span class="font-mono text-blue-600">{{ flexibleHoursStore.bigFrame.start_date }}</span>
                        至
                        <span class="font-mono text-blue-600">{{ flexibleHoursStore.bigFrame.end_date }}</span>
                    </p>
                </div>
                <!-- 員工設定總覽 -->
                <div class="space-y-4">
                    <div v-for="employee in employeeStore.employees" :key="`overview-${employee.id}`"
                        class="border rounded-lg overflow-hidden">
                        <div class="bg-gray-100 p-3 flex justify-between items-center">
                            <h4 class="font-bold text-gray-900">{{ employee.name }}</h4>
                            <p class="text-sm text-gray-700">預設最少休假: <span
                                    class="font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{{
                                        flexibleHoursStore.bigFrame.min_leave_default[employee.name] || 0 }}</span> 天</p>
                        </div>
                        <div class="p-3">
                            <table class="min-w-full leading-normal text-xs"
                                v-if="flexibleHoursStore.smallFrame[employee.name]?.length">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-2 py-1 text-left font-medium text-gray-600">開始日</th>
                                        <th class="px-2 py-1 text-left font-medium text-gray-600">結束日</th>
                                        <th class="px-2 py-1 text-left font-medium text-gray-600">ZZ</th>
                                        <th class="px-2 py-1 text-left font-medium text-gray-600">YY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="rule in flexibleHoursStore.smallFrame[employee.name]" :key="rule.id"
                                        class="text-gray-700">
                                        <td class="px-2 py-1">{{ rule.start_day }}</td>
                                        <td class="px-2 py-1">{{ rule.end_day }}</td>
                                        <td class="px-2 py-1">{{ rule.ZZ }}</td>
                                        <td class="px-2 py-1">{{ rule.YY }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-else class="text-center text-gray-500 py-2 text-sm">尚無小框規則</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
