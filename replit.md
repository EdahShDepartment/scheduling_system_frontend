# Scheduling System

## Overview
This is a Vue 3 + Vite employee scheduling application with a modern UI built using Tailwind CSS. The system allows managing employee data, shift configurations, flexible hours, and automatic scheduling.

## Project Structure
- **Frontend**: Vue 3 single-page application
- **Build Tool**: Vite 7.1.7
- **UI Framework**: Tailwind CSS with Iconify icons
- **Router**: Vue Router 4

## Technology Stack
- Vue 3.5.22 with Composition API (script setup)
- Vue Router 4.5.1 for routing
- Vite 7.1.7 for development and building
- Tailwind CSS 3.4.18 for styling
- @iconify/vue 5.0.0 for icons

## Features
- Employee data management (員工資料設定)
- Shift configuration (班別設定)
- Main settings (主要設定)
- Flexible hours configuration (變形工時設定)
- Rules and health checks (規則與健檢)
- Scheduling results (排班結果)

## Development
The application runs on port 5000 with the following configuration:
- Host: 0.0.0.0 (for Replit compatibility)
- Port: 5000
- HMR configured for WebSocket Secure (WSS)

## Recent Changes (October 3, 2025)
### Initial Setup
- Configured Vite to work with Replit environment
- Updated base path from '/scheduling-system/' to '/' for Replit
- Configured server to bind to 0.0.0.0:5000
- Set up HMR for proper WebSocket connection in Replit
- Installed all dependencies

### State Management Refactoring
- Migrated from basic reactive stores to Pinia (Vue 3 official state management)
- Implemented data persistence using pinia-plugin-persistedstate
- All data now persists to localStorage automatically
- Created 4 Pinia stores:
  - **employeeStore**: Manages employee data, licenses, vacation dates
  - **shiftStore**: Manages shift configurations
  - **settingsStore**: Manages main settings (schedule month, non-working days, external list)
  - **flexibleHoursStore**: Manages flexible hours configurations
- Updated all page components to use new Pinia stores
- Data now persists across page refreshes

## Project Architecture
- `src/pages/`: Contains all page components
- `src/components/`: Reusable components (Sidebar, Footer)
- `src/store/`: Pinia state management stores with localStorage persistence
  - `employeeStore.js`: Employee management
  - `shiftStore.js`: Shift management
  - `settingsStore.js`: Main application settings
  - `flexibleHoursStore.js`: Flexible hours configuration
- `src/router.js`: Route configuration
- `src/App.vue`: Main application component with page navigation
- `src/main.js`: Application entry point with Pinia initialization

## Running the Application
The application is configured to run automatically via the Server workflow:
```bash
npm run dev
```

## Build for Production
```bash
npm run build
```
