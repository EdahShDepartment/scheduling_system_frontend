import { reactive } from 'vue';

export const shiftStore = reactive({
    // 根據您的範例，建立更詳細的班別資料結構
    shifts: [
        { id: 1, name: "ED_A", min_staff: 1, priority: 3, avoid_on_weekend: true, work_on_holiday: true, start_time: "08:00", end_time: "17:00" },
        { id: 2, name: "EDA_A", min_staff: 1, priority: 3, avoid_on_weekend: true, work_on_holiday: true, start_time: "08:00", end_time: "17:00" },
        { id: 3, name: "ED_AS", min_staff: 1, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "08:00", end_time: "12:00" },
        { id: 4, name: "EDA_AS", min_staff: 1, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "08:00", end_time: "12:00" },
        { id: 5, name: "EDPT", min_staff: 1, priority: 3, avoid_on_weekend: true, work_on_holiday: true, start_time: "08:30", end_time: "17:00" },
        { id: 6, name: "B+GI", min_staff: 1, priority: 0, avoid_on_weekend: true, work_on_holiday: true, start_time: "09:00", end_time: "18:00" },
        { id: 7, name: "EDAGI", min_staff: 1, priority: 1, avoid_on_weekend: true, work_on_holiday: true, start_time: "09:00", end_time: "18:00" },
        { id: 8, name: "EDGI-FRI", min_staff: 1, priority: 0, avoid_on_weekend: true, work_on_holiday: true, start_time: "08:30", end_time: "17:00" },
        { id: 9, name: "Meta", min_staff: 1, priority: 2, avoid_on_weekend: true, work_on_holiday: false, start_time: "08:00", end_time: "17:00" },
        { id: 10, name: "NEURO", min_staff: 1, priority: 2, avoid_on_weekend: true, work_on_holiday: false, start_time: "08:00", end_time: "17:00" },
        { id: 11, name: "CV", min_staff: 1, priority: 1, avoid_on_weekend: true, work_on_holiday: false, start_time: "08:00", end_time: "17:00" },
        { id: 12, name: "ORT", min_staff: 1, priority: 1, avoid_on_weekend: true, work_on_holiday: false, start_time: "08:00", end_time: "17:00" },
        { id: 13, name: "EDAPT+B16", min_staff: 1, priority: 1, avoid_on_weekend: true, work_on_holiday: false, start_time: "08:00", end_time: "17:00" },
        { id: 14, name: "EDGI", min_staff: 1, priority: 1, avoid_on_weekend: true, work_on_holiday: false, start_time: "08:00", end_time: "17:00" },
        { id: 15, name: "B16DK", min_staff: 2, priority: 3, avoid_on_weekend: true, work_on_holiday: false, start_time: "08:00", end_time: "17:30" },
        { id: 16, name: "B16DX", min_staff: 1, priority: 3, avoid_on_weekend: true, work_on_holiday: false, start_time: "08:30", end_time: "17:30" },
        { id: 17, name: "P.E.", min_staff: 1, priority: 3, avoid_on_weekend: true, work_on_holiday: false, start_time: "07:00", end_time: "16:00" },
        { id: 18, name: "LDCT+ENT", min_staff: 1, priority: 0, avoid_on_weekend: true, work_on_holiday: false, start_time: "07:00", end_time: "16:00" },
        { id: 19, name: "EDAPT+LDCT", min_staff: 1, priority: 0, avoid_on_weekend: true, work_on_holiday: false, start_time: "07:00", end_time: "16:00" },
        { id: 20, name: "Uro+LDCT", min_staff: 1, priority: 0, avoid_on_weekend: true, work_on_holiday: false, start_time: "07:00", end_time: "16:00" },
        { id: 21, name: "ENT+LDCT", min_staff: 1, priority: 0, avoid_on_weekend: true, work_on_holiday: false, start_time: "07:00", end_time: "16:00" },
        { id: 22, name: "外檢1", min_staff: 2, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "12:30", end_time: "21:00" },
        { id: 23, name: "外檢2", min_staff: 2, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "07:30", end_time: "15:30" },
        { id: 24, name: "外檢3", min_staff: 2, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "07:30", end_time: "15:30" },
        { id: 25, name: "外檢4", min_staff: 2, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "12:30", end_time: "21:00" },
        { id: 26, name: "外檢5", min_staff: 2, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "07:30", end_time: "15:30" },
        { id: 27, name: "外檢6", min_staff: 2, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "07:30", end_time: "15:30" },
        { id: 28, name: "外檢7", min_staff: 2, priority: 0, avoid_on_weekend: false, work_on_holiday: false, start_time: "12:30", end_time: "21:00" }
    ],

    /**
     * 提供一個只包含班別名稱的陣列，方便下拉選單使用
     * @returns {string[]}
     */
    get shiftNames() {
        return this.shifts.map(s => s.name);
    },

    /**
     * 新增一個班別
     * @param {object} newShift - 新班別的完整資料物件
     */
    addShift(newShift) {
        if (newShift.name && !this.shifts.some(s => s.name === newShift.name)) {
            const newId = this.shifts.length > 0 ? Math.max(...this.shifts.map(s => s.id)) + 1 : 1;
            this.shifts.push({ id: newId, ...newShift });
        }
    },

    /**
     * 根據 ID 移除一個班別
     * @param {number} shiftId - 要移除的班別 ID
     */
    removeShift(shiftId) {
        this.shifts = this.shifts.filter(s => s.id !== shiftId);
    }
});

