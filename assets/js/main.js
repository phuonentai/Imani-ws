import { charts } from '@params';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile menu toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Talent Modal functionality ---
    const talentCards = document.querySelectorAll('.talent-card');
    const talentModal = document.getElementById('talent-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalButton = document.getElementById('close-modal');
    const modalName = document.getElementById('modal-name');
    const modalTitle = document.getElementById('modal-title');
    const modalBio = document.getElementById('modal-bio');

    talentCards.forEach(card => {
        card.addEventListener('click', () => {
            modalName.textContent = card.dataset.name;
            modalTitle.textContent = card.dataset.title;
            modalBio.textContent = card.dataset.bio;
            talentModal.classList.remove('hidden');
            setTimeout(() => modalContent.classList.remove('scale-95', 'opacity-0'), 50);
        });
    });

    function closeModal() {
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => talentModal.classList.add('hidden'), 300);
    }

    if(closeModalButton) closeModalButton.addEventListener('click', closeModal);
    if(talentModal) talentModal.addEventListener('click', (e) => {
        if (e.target === talentModal) closeModal();
    });

    // --- Contact form handling ---
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactForm.classList.add('hidden');
            formSuccessMessage.classList.remove('hidden');
        });
    }

    // --- Interactive Dashboard with Chart.js ---
    const tabs = document.querySelectorAll('.dashboard-tab');
    const panes = document.querySelectorAll('.dashboard-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.add('hidden'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.remove('hidden');
        });
    });

    // --- Interactive Timeline Animation on Scroll ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // General Chart.js options for a consistent look
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { family: "'Inter', sans-serif" }}},
            tooltip: {
                backgroundColor: '#121212',
                titleFont: { family: "'Lora', serif", size: 16 },
                bodyFont: { family: "'Inter', sans-serif", size: 12 },
            }
        },
        scales: {
            y: { beginAtZero: true, ticks: { font: { family: "'Inter', sans-serif" }}},
            x: { ticks: { font: { family: "'Inter', sans-serif" }}}
        }
    };

    // Chart 1: Monthly Revenue
    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (revenueCtx) new Chart(revenueCtx, { type: 'bar', data: charts.revenue, options: chartOptions });

    // Chart 2: Cash Flow
    const cashflowCtx = document.getElementById('cashflowChart')?.getContext('2d');
    if (cashflowCtx) new Chart(cashflowCtx, { type: 'line', data: charts.cashflow, options: chartOptions });

    // Chart 3: Customer Growth
    const growthCtx = document.getElementById('growthChart')?.getContext('2d');
    if (growthCtx) new Chart(growthCtx, {
        type: 'doughnut',
        data: charts.growth,
        options: {
            responsive: true,
            maintainAspectRatio: false,
             plugins: {
                legend: { position: 'top', labels: { font: { family: "'Inter', sans-serif" }}},
                tooltip: chartOptions.plugins.tooltip
            }
        }
    });

 const solutionChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { family: "'Inter', sans-serif" }}},
            tooltip: {
                backgroundColor: '#121212',
                titleFont: { family: "'Lora', serif", size: 16 },
                bodyFont: { family: "'Inter', sans-serif", size: 12 },
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: { family: "'Inter', sans-serif" },
                    callback: function(value) { return '€' + value + 'k'; }
                }
            },
            x: { ticks: { font: { family: "'Inter', sans-serif" }}}
        }
    };

    // Chart 1: Cash Flow Forecasting
    const solutionsCashflowCtx = document.getElementById('cashflowSolutionChart')?.getContext('2d');
    if (solutionsCashflowCtx) {
        fetch('/solutions/cashflow.json')
            .then(response => response.json())
            .then(data => {
                new Chart(solutionsCashflowCtx, { type: 'line', data: data, options: solutionChartOptions });
            });
    }

    // Chart 2: Scenario Planning
    const scenarioCtx = document.getElementById('scenarioSolutionChart')?.getContext('2d');
    if (scenarioCtx) {
        fetch('/solutions/scenario.json')
            .then(response => response.json())
            .then(data => {
                new Chart(scenarioCtx, { type: 'bar', data: data, options: { ...solutionChartOptions, scales: { x: { stacked: false }, y: { stacked: false } } } });
            });
    }

    // Chart 3: Budget & Variance Analysis
    const budgetCtx = document.getElementById('budgetSolutionChart')?.getContext('2d');
    if (budgetCtx) {
        fetch('/solutions/budget.json')
            .then(response => response.json())
            .then(chartData => {
                const budgetData = chartData.rawData;
                new Chart(budgetCtx, {
                    type: 'bar',
                    data: {
                        labels: budgetData.map(d => d.category),
                        datasets: [{
                            label: 'Budget',
                            data: budgetData.map(d => d.budget),
                            backgroundColor: 'rgba(116, 185, 255, 0.5)',
                        }, {
                            label: 'Actueel',
                            data: budgetData.map(d => d.actual),
                            backgroundColor: 'rgba(0, 184, 148, 0.7)',
                        }]
                    },
                    options: {
                        ...solutionChartOptions,
                        plugins: {
                            ...solutionChartOptions.plugins,
                            tooltip: {
                                ...solutionChartOptions.plugins.tooltip,
                                callbacks: {
                                    afterBody: function(context) {
                                        if (context[0].datasetIndex === 1) {
                                            const i = context[0].dataIndex;
                                            const variance = budgetData[i].actual - budgetData[i].budget;
                                            return `\nVariantie: €${variance}k\nDriver: ${budgetData[i].driver}`;
                                        }
                                        return '';
                                    }
                                }
                            }
                        }
                    }
                });
            });
    }


    
});