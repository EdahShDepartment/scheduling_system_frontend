import { reactive } from 'vue';

export const flexibleHoursStore = reactive({
    // 大框資訊
    bigFrame: {
        start_date: "2025-10-01",
        end_date: "2025-10-25",
        min_leave_default: {
            "陳小美": 8,
            "林志明": 7,
            "張雅婷": 9,
        }
    },

    // 小框資訊
    smallFrame: {
        "陳小美": [{ id: 1, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 2, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
        "林志明": [{ id: 3, start_day: 0, end_day: 12, ZZ: 1, YY: 2 }, { id: 4, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
        "張雅婷": [{ id: 5, start_day: 0, end_day: 12, ZZ: 0, YY: 2 }, { id: 6, start_day: 13, end_day: 26, ZZ: 0, YY: 2 }],
    },

    /**
     * 為指定員工新增一條小框規則
     * @param {string} employeeName - 員工姓名
     * @param {object} newRule - 新規則物件 { start_day, end_day, ZZ, YY }
     */
    addSmallFrameRule(employeeName, newRule) {
        if (!this.smallFrame[employeeName]) {
            this.smallFrame[employeeName] = [];
        }
        const newId = Date.now() + Math.random(); // 產生唯一ID
        this.smallFrame[employeeName].push({ id: newId, ...newRule });
    },

    /**
     * 移除指定員工的某條小框規則
     * @param {string} employeeName - 員工姓名
     * @param {number} ruleId - 規則的ID
     */
    removeSmallFrameRule(employeeName, ruleId) {
        if (this.smallFrame[employeeName]) {
            this.smallFrame[employeeName] = this.smallFrame[employeeName].filter(rule => rule.id !== ruleId);
        }
    }
});
