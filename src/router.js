import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const router = createRouter({
    history: createWebHistory('/scheduling-system'),
    routes: [
        { path: '/', component: App },
    ],
})

export default router