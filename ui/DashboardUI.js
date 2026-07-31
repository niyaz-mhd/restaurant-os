import {
    totalRevenue,
    totalOrders,
    occupiedTables,
    availableTables,
    popularDishes
} from "../services/StatsService.js";

class DashboardUI {
    render() {
        const statOrders = document.getElementById("stat-orders");
        const statRevenue = document.getElementById("stat-revenue");
        const statOccupied = document.getElementById("stat-occupied");
        const statAvailable = document.getElementById("stat-available");
        const popularList = document.getElementById("popular-dishes-list");

        if (statOrders) statOrders.textContent = totalOrders();
        if (statRevenue) statRevenue.textContent = `$${totalRevenue().toFixed(2)}`;
        if (statOccupied) statOccupied.textContent = occupiedTables();
        if (statAvailable) statAvailable.textContent = availableTables();

        if (popularList) {
            popularList.innerHTML = "";
            const dishes = popularDishes();
            if (dishes.length === 0) {
                popularList.innerHTML = `<tr><td colspan="2" style="text-align: center; color: var(--light-text); padding: 15px;">No orders placed yet.</td></tr>`;
            } else {
                dishes.forEach(([name, count]) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><strong>${name}</strong></td>
                        <td>${count} units sold</td>
                    `;
                    popularList.appendChild(tr);
                });
            }
        }
    }
}

export default new DashboardUI();
