Financial Data Visualization Dashboard
A sophisticated, enterprise-grade financial data visualization application built with React, Vite, and Material-UI. This dashboard provides traders and financial analysts with a powerful tool to analyze the performance, volatility, and liquidity of financial instruments through an intuitive, interactive calendar interface. It connects to the live Binance API for real-time data and features an advanced, customizable theming system.

Application shown with the "GoQuant" theme

✨ Key Features
Live Data Integration: Fetches historical daily data directly from the public Binance API.
Interactive Calendar: A fully-featured calendar serving as the main navigation, with multiple views:
Daily View: A detailed grid showing performance and volume for each day.
Weekly View: A summarized list of aggregated performance for each week of the month.
Monthly View: A high-level card summarizing the entire month's performance.
Visual Data Indicators:
Performance Arrows: Daily cells show up/down arrows with percentage change for at-a-glance analysis.
Volatility Heatmaps: Background colors on daily cells and monthly cards visually represent low, medium, or high volatility periods.
Advanced Dashboard Panel: A slide-out drawer provides in-depth analysis for any selected day, week, month, or custom date range.
Custom Range Selection: Click-to-select functionality on the calendar allows users to define and analyze custom time periods.
Advanced Charting (Recharts):
Price & SMA: A composed chart displaying closing price and a Simple Moving Average (SMA).
RSI Indicator: A chart showing the Relative Strength Index (RSI) with overbought and oversold reference lines.
Interactive Brush: A brush component on charts allows users to zoom in on specific time periods.
Data Export: Functionality to export custom range data to CSV and PDF formats. The PDF export includes both summary data and a snapshot of the charts.
Advanced Theming System: A robust theming architecture using Material-UI, supporting multiple schemes:
GoQuant: A sleek, professional dark theme inspired by trading platforms.
Light & Dark: Standard light and dark modes.
Colorblind-Friendly: A high-contrast theme using a blue/orange palette.
Accessibility: Full keyboard navigation support for the calendar, enabling users to navigate days, weeks, and months without a mouse.
🚀 Tech Stack
Framework: React (v19)
Build Tool: Vite
Language: JavaScript
UI Library: Material-UI (MUI)
Charting: Recharts
API Client: Axios
Date Management: date-fns
Data Export:
PDF: jsPDF & jspdf-autotable
CSV: Papa Parse
Chart to Image: html2canvas
State Management: React Hooks (useState, useEffect, useMemo, useCallback) & Custom Hooks.
📂 Project Structure
The project is organized into a modular and scalable structure for maintainability.

text
/
├── public/
├── src/
│   ├── components/
│   │   ├── Calendar/         # All components related to the main calendar
│   │   │   ├── Calendar.jsx
│   │   │   ├── CalendarCell.jsx
│   │   │   ├── CalendarHeader.jsx
│   │   │   ├── MonthlyView.jsx
│   │   │   └── PeriodCell.jsx
│   │   └── DashboardPanel/   # The slide-out detail panel
│   │       └── DashboardPanel.jsx
│   ├── hooks/
│   │   └── useFinancialData.js # Custom hook for data fetching and processing
│   ├── services/
│   │   └── binanceApi.js     # Logic for fetching data from Binance
│   ├── styles/
│   │   └── theme.js          # MUI theme configurations
│   ├── utils/
│   │   ├── dataProcessor.js  # Aggregation and metric calculation logic
│   │   └── indicatorCalculations.js # SMA and RSI calculation functions
│   ├── App.jsx               # Main application component, manages state and layout
│   └── main.jsx              # Entry point of the React application
├── .eslintrc.cjs
├── package.json
└── README.md
🔧 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
You need to have Node.js (version 18.x or newer) and npm or yarn installed.

Installation & Setup
Clone the repository:

sh
git clone https://github.com/shree998/financial-calendar.git
cd financial-dashboard
Install dependencies:
Using npm:

sh
npm install
or using yarn:

sh
yarn install
Run the development server:
This command will start the Vite development server. Open your browser and navigate to the local URL provided (usually http://localhost:5173).

sh
npm run dev
Available Scripts
npm run dev: Starts the development server with Hot Module Replacement.
npm run build: Compiles and bundles the application for production into the dist folder.
npm run preview: Serves the production build locally for previewing.
npm run lint: Lints the source files using ESLint.
💡 Architecture and Data Flow
The application follows a clean, component-based architecture with a unidirectional data flow.

Data Fetching: The useFinancialData custom hook is triggered in App.jsx. It calls fetchKlineData from src/services/binanceApi.js to get the last year of daily candlestick data for the selected financial instrument.

Data Processing: The raw data is passed to processDataIntoMap in src/utils/dataProcessor.js. This function calculates daily metrics (performance, volatility) and stores the data in a Map for efficient lookups.

State Management:

Data State: useFinancialData manages the core dataMap, as well as isLoading and error states.
UI State: App.jsx manages the UI state, including the selected financialInstrument, themeMode, the isPanelOpen flag, and the dateRange for custom selections.
Component Interaction:

App.jsx passes the dataMap to the Calendar component.
The Calendar renders the appropriate view (daily, weekly, monthly) and calculates aggregated data on the fly using helpers from dataProcessor.js.
User interactions in the Calendar (e.g., clicking a day, a week, or completing a range) call the handleItemClick function in App.jsx.
handleItemClick updates the application state, which may involve setting panelData and opening the DashboardPanel.
The DashboardPanel receives the specific data slice for the selected period and renders the detailed statistics and advanced charts.# test
