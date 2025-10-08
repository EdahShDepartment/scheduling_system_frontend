<script setup>
import { computed, ref } from 'vue'
import { useSettingsStore } from '../store/rulesSettingsStore.js';
import { useResultsStore } from '../store/resultsStore.js';
import * as XLSX from 'xlsx';

const settingsStore = useSettingsStore();
const resultsStore = useResultsStore();

const year = computed(() => resultsStore.scheduleMonth ? resultsStore.scheduleMonth.split('-')[0] : '');
const month = computed(() => resultsStore.scheduleMonth ? resultsStore.scheduleMonth.split('-')[1] : '');

const scheduleData = computed(() => resultsStore.schedule);

const daysInMonth = computed(() => {
    if (!year.value || !month.value) return [];
    const date = new Date(year.value, month.value - 1, 1);
    const days = [];
    while (date.getMonth() === month.value - 1) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
});

const nonWorkingDaysSet = computed(() => new Set(settingsStore.nonWorkingDays));

function getDayOfWeek(date) {
    const dayIndex = date.getDay();
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[dayIndex];
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function isNonWorkingDay(date) {
    const dateString = toUTCDateString(date);
    return nonWorkingDaysSet.value.has(dateString);
}

function toUTCDateString(date) {
    // 複製日期物件，避免改到原本的 date
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
}

function downloadExcel() {
    if (!scheduleData.value) return;

    const header = ['員工', ...daysInMonth.value.map(d => `${d.getDate()}(${getDayOfWeek(d)})`)];
    const data = Object.entries(scheduleData.value).map(([employee, schedule]) => {
        const row = [employee];
        daysInMonth.value.forEach(day => {
            const dateString = toUTCDateString(day);
            row.push(schedule[dateString] || '');
        });
        return row;
    });

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '排班結果');

    XLSX.writeFile(workbook, `${year.value}-${month.value}排班表.xlsx`);
}
</script>

<template>
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-4 border-b flex justify-between items-center">
            <div>
                <h3 v-if="year && month" class="text-xl font-semibold">{{ year }} 年 {{ month }} 月排班結果</h3>
                <h3 v-else class="text-xl font-semibold">排班結果</h3>
            </div>
            <button v-if="scheduleData" @click="downloadExcel"
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                下載 Excel
            </button>
        </div>

        <div v-if="resultsStore.isLoading" class="p-8 text-center text-gray-500">
            排班中，請稍候...
        </div>
        <div v-else-if="resultsStore.error" class="p-8 text-center text-red-500">
            排班失敗：{{ resultsStore.error }}
        </div>
        <div v-else-if="!scheduleData" class="p-8 text-center text-gray-500">
            尚未產生排班結果。
        </div>
        <div v-else class="overflow-x-auto">
            <table class="min-w-full leading-normal text-xs border-collapse">
                <thead class="bg-gray-100 sticky top-0">
                    <tr>
                        <th
                            class="px-2 py-2 border text-left font-semibold text-gray-600 w-28 sticky left-0 bg-gray-100 z-10">
                            員工
                        </th>
                        <th v-for="day in daysInMonth" :key="day"
                            class="px-2 py-2 border text-center font-semibold text-gray-600 w-16" :class="{
                                'bg-red-100': isWeekend(day) || isNonWorkingDay(day)
                            }">
                            <div>{{ day.getDate() }}</div>
                            <div>({{ getDayOfWeek(day) }})</div>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr v-for="(schedule, employee) in scheduleData" :key="employee" class="border-b hover:bg-gray-50">
                        <td class="px-2 py-2 border text-left font-medium text-gray-800 sticky left-0 bg-white z-10">{{
                            employee }}
                        </td>
                        <td v-for="day in daysInMonth" :key="day" class="px-2 py-2 border text-center text-gray-500"
                            :class="{
                                'bg-red-50': isWeekend(day) || isNonWorkingDay(day)
                            }">
                            {{ schedule[toUTCDateString(day)] || '' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>