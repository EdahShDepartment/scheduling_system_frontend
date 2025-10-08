import { defineStore } from 'pinia'

export const useResultsStore = defineStore('results', {
    state: () => ({
        schedule: null,
        isLoading: false,
        error: null,
        scheduleMonth: null,
    }),
    actions: {
        setSchedule(schedule) {
            this.schedule = schedule
            this.isLoading = false
            this.error = null
        },
        setLoading(isLoading) {
            this.isLoading = isLoading
        },
        setError(error) {
            this.error = error
            this.isLoading = false
        },
        clearResults() {
            this.schedule = null
            this.error = null
        },
        setScheduleMonth(month) {
            this.scheduleMonth = month
        }
    },
})