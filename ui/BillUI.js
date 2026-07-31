import { calculateGrandTotal } from "../services/BillingService.js";
import { state } from "../core/state.js";
import { CONFIG } from "../core/config.js";

class BillUI {
    constructor() {
        this.container = document.querySelector(".bill-items");
        this.titleElement = document.querySelector(".bill-panel h2");
    }

    render(order) {
        if (!this.container) {
            this.container = document.querySelector(".bill-items");
        }
        if (!this.titleElement) {
            this.titleElement = document.querySelector(".bill-panel h2");
        }

        if (this.titleElement) {
            if (state.selectedTable) {
                this.titleElement.textContent = `Current Order - Table ${state.selectedTable.id}`;
            } else {
                this.titleElement.textContent = "Current Order";
            }
        }

        if (!order || order.items.length === 0) {
            this.clear();
            return;
        }

        this.container.innerHTML = "";
        order.items.forEach(item => {
            const itemEl = document.createElement("div");
            itemEl.className = "bill-item";
            itemEl.innerHTML = `
                <div class="bill-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn minus-btn" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}" style="margin-left: 8px;">
                        <i class="fa-solid fa-trash remove-btn" data-id="${item.id}"></i>
                    </button>
                </div>
            `;
            this.container.appendChild(itemEl);
        });

        const discountPercent = order.discountPercent || 0;
        const totals = calculateGrandTotal(order.items, discountPercent);

        const subtotalEl = document.getElementById("bill-subtotal");
        const taxEl = document.getElementById("bill-tax");
        const taxLabelEl = document.getElementById("bill-tax-label");
        const discountInput = document.getElementById("bill-discount-input");
        const totalEl = document.getElementById("bill-total");

        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${totals.gst.toFixed(2)}`;
        if (taxLabelEl) taxLabelEl.textContent = `GST (${CONFIG.GST_PERCENTAGE}%)`;
        if (discountInput) discountInput.value = discountPercent;
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = "No items selected.";
        }
        
        const subtotalEl = document.getElementById("bill-subtotal");
        const taxEl = document.getElementById("bill-tax");
        const discountInput = document.getElementById("bill-discount-input");
        const totalEl = document.getElementById("bill-total");

        if (subtotalEl) subtotalEl.textContent = "$0.00";
        if (taxEl) taxEl.textContent = "$0.00";
        if (discountInput) discountInput.value = 0;
        if (totalEl) totalEl.textContent = "$0.00";
    }
}

export default new BillUI();
