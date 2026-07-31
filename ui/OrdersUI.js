import { state } from "../core/state.js";

class OrdersUI {
    render() {
        const container = document.getElementById("completed-orders-list");
        if (!container) return;

        container.innerHTML = "";
        const orders = state.orders;

        if (!orders || orders.length === 0) {
            container.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--light-text); padding: 15px;">No completed orders.</td></tr>`;
            return;
        }

        // Sort orders by date descending
        const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        sortedOrders.forEach(order => {
            const tr = document.createElement("tr");
            const date = new Date(order.createdAt).toLocaleString();
            const itemsStr = order.items.map(item => `${item.name} (x${item.quantity})`).join(", ");
            tr.innerHTML = `
                <td>${date}</td>
                <td>Table ${order.tableId}</td>
                <td>${itemsStr}</td>
                <td><strong>$${Number(order.total || 0).toFixed(2)}</strong></td>
                <td>
                    <button class="primary-btn print-order-btn" data-order-time="${order.createdAt}" style="padding: 6px 12px; font-size: 13px; background: var(--accent);">
                        Print Receipt
                    </button>
                </td>
            `;
            container.appendChild(tr);
        });
    }
}

export default new OrdersUI();
