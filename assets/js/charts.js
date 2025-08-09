// assets/js/charts.js

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.chartData === 'undefined') {
        console.error("Chart data not found. Make sure it's passed from the template.");
        return;
    }

    const chartOptions = { /* ... your chart options ... */ }; // Keeping options for brevity
    const initializedCharts = {}; // Object to track which charts have been created

    // Function to create a specific chart
    const createChart = (chartId, chartType, data) => {
        const ctx = document.getElementById(chartId);
        if (ctx && !initializedCharts[chartId]) { // Only create if it doesn't exist
            new Chart(ctx, {
                type: chartType,
                data: data,
                options: chartOptions // Use your predefined options
            });
            initializedCharts[chartId] = true; // Mark as initialized
        }
    };

    // --- Initialize the default visible chart on page load ---
    createChart('revenueChart', 'bar', window.chartData.revenue);

    // --- Add event listeners to tabs to create other charts on click ---
    const tabs = document.querySelectorAll('.dashboard-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab; // e.g., "cashflow" or "growth"
            
            if (tabName === 'cashflow') {
                createChart('cashflowChart', 'line', window.chartData.cashflow);
            } else if (tabName === 'growth') {
                // Doughnut charts have slightly different options
                const growthOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: chartOptions.plugins.tooltip
                    }
                };
                const ctx = document.getElementById('growthChart');
                if (ctx && !initializedCharts['growthChart']) {
                     new Chart(ctx, { type: 'doughnut', data: window.chartData.growth, options: growthOptions });
                     initializedCharts['growthChart'] = true;
                }
            }
        });
    });
});