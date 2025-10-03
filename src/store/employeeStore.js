import { reactive } from 'vue';

// 使用 reactive 讓這個物件變成響應式的
// 這表示任何對 employees 陣列的修改，都會自動觸發 Vue 元件的更新
export const employeeStore = reactive({
    // 初始員工資料範例，包含更多詳細資訊
    employees: [
        { id: 1, name: '陳小美', lastMonthConsecutive: 2, hasLicense: true, vacationDates: ['2025-10-10', '2025-10-25'] },
        { id: 2, name: '林志明', lastMonthConsecutive: 0, hasLicense: false, vacationDates: ['2025-10-15'] },
        { id: 3, name: '張雅婷', lastMonthConsecutive: 4, hasLicense: true, vacationDates: [] },
    ],

    /**
     * 新增一位員工，並給予預設值
     * @param {string} name - 新員工的姓名
     */
    addEmployee(name) {
        if (name && !this.employees.some(e => e.name === name)) {
            const newId = this.employees.length > 0 ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
            this.employees.push({
                id: newId,
                name: name,
                lastMonthConsecutive: 0,
                hasLicense: false,
                vacationDates: [],
            });
        }
    },

    /**
     * 根據 ID 移除一位員工
     * @param {number} employeeId - 要移除的員工 ID
     */
    removeEmployee(employeeId) {
        this.employees = this.employees.filter(e => e.id !== employeeId);
    }
});

