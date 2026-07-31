import { state } from "../core/state.js";
import { totalRevenue, occupiedTables } from "../services/StatsService.js";

let trendChart = null;
let categoryChart = null;

class AnalyticsUI {
    render() {
        const revEl = document.getElementById("analytics-revenue");
        const textEl = document.getElementById("analytics-occupancy-text");
        const barEl = document.getElementById("analytics-occupancy-bar");

        if (revEl) {
            revEl.textContent = `$${totalRevenue().toFixed(2)}`;
        }

        if (textEl && barEl) {
            const occupied = occupiedTables();
            const total = state.tables.length || 20;
            const rate = total > 0 ? (occupied / total) * 100 : 0;
            textEl.textContent = `${occupied}/${total} occupied (${rate.toFixed(0)}%)`;
            barEl.style.width = `${rate}%`;
        }

        this.renderTrendChart();
        this.renderCategoryChart();
    }

    renderTrendChart() {
        const canvas = document.getElementById("salesTrendChart");
        if (!canvas) return;

        if (trendChart) {
            trendChart.destroy();
        }

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString(undefined, { weekday: 'short' });
        }).reverse();

        const salesPerDay = last7Days.reduce((acc, day) => {
            acc[day] = 0;
            return acc;
        }, {});

        state.orders.forEach(order => {
            const day = new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'short' });
            if (day in salesPerDay) {
                salesPerDay[day] += Number(order.total || 0);
            }
        });

        const labels = last7Days;
        const data = last7Days.map(day => salesPerDay[day]);

        const ctx = canvas.getContext("2d");
        trendChart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Revenue ($)",
                    data,
                    borderColor: "#ff6b35",
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: "rgba(128,128,128,0.8)" },
                        grid: { borderDash: [5, 5] }
                    },
                    x: {
                        ticks: { color: "rgba(128,128,128,0.8)" }
                    }
                }
            }
        });
    }

    renderCategoryChart() {
        const canvas = document.getElementById("categoryChart");
        if (!canvas) return;

        if (categoryChart) {
            categoryChart.destroy();
        }

        const categorySales = {};
        state.orders.forEach(order => {
            order.items.forEach(item => {
                const dish = state.dishes.find(d => d.id === item.id);
                const category = dish ? dish.category : "Other";
                categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
            });
        });

        const labels = Object.keys(categorySales);
        const data = Object.values(categorySales);

        if (labels.length === 0) {
            labels.push("No Sales");
            data.push(1);
        }

        const ctx = canvas.getContext("2d");
        categoryChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: [
                        "#ff6b35",
                        "#4ecdc4",
                        "#3498db",
                        "#f1c40f",
                        "#9b59b6",
                        "#e74c3c"
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: { color: "rgba(128,128,128,0.8)" }
                    }
                }
            }
        });
    }
}

export default new AnalyticsUI();
