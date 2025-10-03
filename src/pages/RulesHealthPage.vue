<script setup>
import { ref, reactive } from 'vue';
import { employeeStore } from '../store/employeeStore.js';
import { shiftStore } from '../store/shiftStore.js';

// --- 現有 script ---
// 指定假日班
const holidayShifts = ref([{ employee: '陳小美', shift: '早班', date: '2025-10-25' }]);
const newHolidayShift = reactive({ employee: '', shift: '', date: '' });
const addHolidayShift = () => {
    if (newHolidayShift.employee && newHolidayShift.shift && newHolidayShift.date) {
        holidayShifts.value.push({ ...newHolidayShift });
        Object.assign(newHolidayShift, { employee: '', shift: '', date: '' });
    }
};
const removeHolidayShift = (index) => holidayShifts.value.splice(index, 1);

// 禁止上班櫃檯
const forbiddenShifts = ref([{ employee: '林志明', shift: 'ED_A' }]);
const newForbiddenShift = reactive({ employee: '', shift: '' });
const addForbiddenShift = () => {
    if (newForbiddenShift.employee && newForbiddenShift.shift) {
        forbiddenShifts.value.push({ ...newForbiddenShift });
        Object.assign(newForbiddenShift, { employee: '', shift: '' });
    }
};
const removeForbiddenShift = (index) => forbiddenShifts.value.splice(index, 1);

// 人員優先櫃檯
const priorityShifts = ref([{ employee: '張雅婷', shift: 'ED_AS' }]);
const newPriorityShift = reactive({ employee: '', shift: '' });
const addPriorityShift = () => {
    if (newPriorityShift.employee && newPriorityShift.shift) {
        priorityShifts.value.push({ ...newPriorityShift });
        Object.assign(newPriorityShift, { employee: '', shift: '' });
    }
};
const removePriorityShift = (index) => priorityShifts.value.splice(index, 1);

// --- 新增: 特殊人員排班規則 ---
const specialRules = ref([
    { shift: 'ENT+LDCT', employees: ['陳小美'] },
    { shift: 'B16DK', employees: ['林志明', '張雅婷'] }
]);
const newSpecialRule = reactive({
    shift: '',
    employees: [] // 存放選中的員工姓名
});

const addSpecialRule = () => {
    if (newSpecialRule.shift && newSpecialRule.employees.length > 0) {
        // 檢查該班別是否已存在規則
        const existingRule = specialRules.value.find(r => r.shift === newSpecialRule.shift);
        if (existingRule) {
            // 若存在，則合併員工名單 (避免重複)
            const newEmployees = newSpecialRule.employees.filter(emp => !existingRule.employees.includes(emp));
            existingRule.employees.push(...newEmployees);
        } else {
            // 不存在則新增一條新規則
            specialRules.value.push({ ...newSpecialRule });
        }
        // 重設表單
        Object.assign(newSpecialRule, { shift: '', employees: [] });
    }
};

const removeSpecialRule = (index) => {
    specialRules.value.splice(index, 1);
};


// 健檢相關
const healthCheckEligible = ref(['陳小美', '張雅婷']);
const selectedHealthCheckEmployee = ref('陳小美');

</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 特殊規則設定 -->
        <div class="bg-white p-6 rounded-lg shadow-md flex flex-col gap-y-6">
            <h3 class="text-xl font-semibold mb-2 border-b pb-3">特殊規則設定</h3>

            <!-- 指定假日班 (維持不變) -->
            <div>
                <h4 class="font-medium text-sm text-gray-800 mb-2">▪ 指定假日班</h4>
                <div v-for="(item, index) in holidayShifts" :key="index" class="list-item">
                    <p class="text-gray-700">
                        <span>{{ item.employee }} / {{ item.shift }} / {{ item.date }}</span>
                    </p>
                    <button @click="removeHolidayShift(index)"
                        class="text-red-500 hover:text-red-700 text-xs font-bold">移除</button>
                </div>
                <div class="input-group mt-2">
                    <select v-model="newHolidayShift.employee"
                        class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
                        <option disabled value="">選擇員工</option>
                        <option v-for="emp in employeeStore.employees" :key="emp.id" :value="emp.name">{{ emp.name }}
                        </option>
                    </select>
                    <input type="text" v-model="newHolidayShift.shift" placeholder="班別"
                        class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
                    <input type="date" v-model="newHolidayShift.date"
                        class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
                    <button @click="addHolidayShift"
                        class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap">新增</button>
                </div>
            </div>

            <!-- 禁止上班櫃檯 (維持不變) -->
            <div>
                <h4 class="font-medium text-sm text-gray-800 mb-2">▪ 禁止某人員上班之櫃檯</h4>
                <div v-for="(item, index) in forbiddenShifts" :key="index" class="list-item">
                    <p class="text-gray-700">
                        <span>{{ item.employee }} / {{ item.shift }}</span>
                    </p>
                    <button @click="removeForbiddenShift(index)"
                        class="text-red-500 hover:text-red-700 text-xs font-bold">移除</button>
                </div>
                <div class="input-group mt-2">
                    <select v-model="newForbiddenShift.employee"
                        class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
                        <option disabled value="">選擇員工</option>
                        <option v-for="emp in employeeStore.employees" :key="emp.id" :value="emp.name">{{ emp.name }}
                        </option>
                    </select>
                    <input type="text" v-model="newForbiddenShift.shift" placeholder="班別/櫃檯"
                        class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
                    <button @click="addForbiddenShift"
                        class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm">新增</button>
                </div>
            </div>

            <!-- 人員優先櫃檯 (維持不變) -->
            <div>
                <h4 class="font-medium text-sm text-gray-800 mb-2">▪ 人員優先櫃檯</h4>
                <div v-for="(item, index) in priorityShifts" :key="index" class="list-item">
                    <p class="text-gray-700">
                        <span>{{ item.employee }} / {{ item.shift }}</span>
                    </p>
                    <button @click="removePriorityShift(index)"
                        class="text-red-500 hover:text-red-700 text-xs font-bold">移除</button>
                </div>
                <div class="input-group mt-2">
                    <select v-model="newPriorityShift.employee"
                        class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
                        <option disabled value="">選擇員工</option>
                        <option v-for="emp in employeeStore.employees" :key="emp.id" :value="emp.name">{{ emp.name }}
                        </option>
                    </select>
                    <input type="text" v-model="newPriorityShift.shift" placeholder="班別/櫃檯"
                        class="flex-1 rounded-md border-gray-300 shadow-sm p-2 text-sm">
                    <button @click="addPriorityShift"
                        class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm">新增</button>
                </div>
            </div>

            <!-- 特殊人員排班規則 -->
            <div>
                <h4 class="font-medium text-sm text-gray-800 mb-2">▪ 特殊人員排班規則</h4>
                <div v-for="(rule, index) in specialRules" :key="index" class="list-item">
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
                            <!-- 更新: 使用新的 shiftStore.shiftNames -->
                            <select v-model="newSpecialRule.shift"
                                class="w-full rounded-md border-gray-300 shadow-sm p-2 text-sm">
                                <option disabled value="">請選擇班別</option>
                                <option v-for="shift in shiftStore.shiftNames" :key="shift" :value="shift">{{ shift }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">選擇對應員工 (可多選)</label>
                            <div class="mt-1 max-h-32 overflow-y-auto border rounded-md p-2 space-y-1 bg-white">
                                <div v-for="emp in employeeStore.employees" :key="emp.id">
                                    <label
                                        class="inline-flex items-center w-full cursor-pointer p-1 rounded hover:bg-gray-100">
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

        <!-- 健檢設定 (維持不變) -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">健檢相關設定</h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700">▪ 能上健檢的名單 (從員工列表勾選)</label>
                    <div class="mt-2 max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                        <div v-for="emp in employeeStore.employees" :key="emp.id">
                            <label class="inline-flex items-center">
                                <input type="checkbox" :value="emp.name" v-model="healthCheckEligible"
                                    class="rounded border-gray-300 text-indigo-600 shadow-sm">
                                <span class="ml-2 text-sm text-gray-700">{{ emp.name }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <label for="healthCheckEmployee" class="block text-sm font-medium text-gray-700">▪ 當月輪健檢之員工</label>
                    <select id="healthCheckEmployee" v-model="selectedHealthCheckEmployee"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                        <option disabled value="">請從符合資格者中選擇</option>
                        <option v-for="employeeName in healthCheckEligible" :key="employeeName" :value="employeeName">
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
