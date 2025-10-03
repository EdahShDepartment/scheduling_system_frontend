<script setup>
import { reactive } from 'vue';
import { shiftStore } from '../store/shiftStore.js';

// 新增班別時的預設值
const newShiftDefaults = {
    name: "",
    min_staff: 1,
    priority: 1,
    avoid_on_weekend: false,
    work_on_holiday: false,
    start_time: "09:00",
    end_time: "18:00",
};

const newShift = reactive({ ...newShiftDefaults });

// 新增班別
const add = () => {
    shiftStore.addShift({ ...newShift });
    // 重設表單
    Object.assign(newShift, newShiftDefaults);
};

// 移除班別
const remove = (shiftId) => {
    if (confirm('確定要刪除這個班別嗎？')) {
        shiftStore.removeShift(shiftId);
    }
};
</script>

<template>
    <div class="flex flex-col gap-6">
        <!-- 班別列表 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">班別列表與編輯</h3>
            <p class="text-sm text-gray-500 mb-4">您可以直接在下方的表格中修改各項班別的屬性。</p>
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
                            <th class="px-3 py-2 text-center font-semibold text-gray-600">操作</th>
                        </tr>
                    </thead>
                    <tbody v-if="shiftStore.shifts.length > 0">
                        <tr v-for="shift in shiftStore.shifts" :key="shift.id" class="border-b hover:bg-gray-50">
                            <td class="px-3 py-2"><input type="text" v-model="shift.name"
                                    class="w-24 p-1 border rounded-md"></td>
                            <td class="px-3 py-2"><input type="number" v-model.number="shift.min_staff" min="0"
                                    class="w-16 p-1 border rounded-md"></td>
                            <td class="px-3 py-2"><input type="number" v-model.number="shift.priority" min="0"
                                    class="w-16 p-1 border rounded-md"></td>
                            <td class="px-3 py-2"><input type="time" v-model="shift.start_time"
                                    class="p-1 border rounded-md"></td>
                            <td class="px-3 py-2"><input type="time" v-model="shift.end_time"
                                    class="p-1 border rounded-md"></td>
                            <td class="px-3 py-2 text-center"><input type="checkbox" v-model="shift.avoid_on_weekend"
                                    class="h-4 w-4 rounded text-indigo-600"></td>
                            <td class="px-3 py-2 text-center"><input type="checkbox" v-model="shift.work_on_holiday"
                                    class="h-4 w-4 rounded text-indigo-600"></td>
                            <td class="px-3 py-2 text-center">
                                <button @click="remove(shift.id)"
                                    class="text-red-500 hover:text-red-700 font-bold">移除</button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="8" class="text-center py-4 text-gray-500">尚未建立任何班別。</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 新增班別 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">新增班別</h3>
            <form @submit.prevent="add" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">班別名稱</label>
                    <input type="text" v-model="newShift.name" required class="w-full p-2 border rounded-md text-sm">
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
                    <input type="time" v-model="newShift.start_time" required
                        class="w-full p-2 border rounded-md text-sm">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">結束時間</label>
                    <input type="time" v-model="newShift.end_time" required
                        class="w-full p-2 border rounded-md text-sm">
                </div>
                <div class="flex items-center gap-4 col-span-1 md:col-span-2">
                    <label class="flex items-center">
                        <input type="checkbox" v-model="newShift.avoid_on_weekend"
                            class="h-4 w-4 rounded text-indigo-600">
                        <span class="ml-2 text-sm text-gray-700">週末不上班</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" v-model="newShift.work_on_holiday"
                            class="h-4 w-4 rounded text-indigo-600">
                        <span class="ml-2 text-sm text-gray-700">國定假日上班</span>
                    </label>
                </div>
                <div class="lg:col-start-4">
                    <button type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full">新增班別</button>
                </div>
            </form>
        </div>
    </div>
</template>
