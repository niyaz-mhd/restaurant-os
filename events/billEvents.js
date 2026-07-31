import { state } from "../core/state.js";

import BillUI from "../ui/BillUI.js";

import Toast from "../ui/Toast.js";

import Storage from "../core/storage.js";

import TableUI from "../ui/TableUI.js";

import {
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    calculateGrandTotal
} from "../services/BillingService.js";

import {
    freeTable
} from "../services/TableService.js";

export function initializeBillEvents() {

    const panel = document.querySelector(".bill-panel");

    if (!panel) return;

    panel.addEventListener("click", (event) => {

        if (!state.currentOrder) return;

        const id = Number(event.target.dataset.id);

        // Increase Quantity
        if (event.target.classList.contains("plus-btn")) {

            increaseQuantity(

                state.currentOrder,

                id

            );

            updateBill();

        }

        // Decrease Quantity
        if (event.target.classList.contains("minus-btn")) {

            decreaseQuantity(

                state.currentOrder,

                id

            );

            updateBill();

        }

        // Remove Item
        if (event.target.classList.contains("remove-btn")) {

            removeItem(

                state.currentOrder,

                id

            );

            Toast.show(

                "Item removed",

                "warning"

            );

            updateBill();

        }

        // Release Table (Free order)
        if (event.target.classList.contains("release-btn")) {

            if (confirm("Are you sure you want to cancel this order and free the table?")) {

                if (state.selectedTable) {

                    state.selectedTable.currentOrder = null;

                    freeTable(state.selectedTable.id);

                }

                state.currentOrder = null;

                state.selectedTable = null;

                BillUI.clear();

                TableUI.refresh();

                Storage.saveState(state);

                Toast.show("Table released", "warning");

            }

        }

        // Checkout
        if (event.target.classList.contains("checkout-btn")) {

            checkout();

        }

    });

    // Discount input listener
    const discountInput = document.getElementById("bill-discount-input");

    if (discountInput) {

        discountInput.addEventListener("input", (e) => {

            if (!state.currentOrder) return;

            let val = Number(e.target.value);

            if (isNaN(val) || val < 0) val = 0;

            if (val > 100) val = 100;

            e.target.value = val;

            state.currentOrder.discountPercent = val;

            updateBill();

        });

    }

}

export function updateBill() {

    const totals = calculateGrandTotal(

        state.currentOrder.items,

        state.currentOrder.discountPercent || 0

    );

    state.currentOrder.total = totals.total;

    BillUI.render(state.currentOrder);

    Storage.saveState(state);

}

function checkout() {

    if (state.currentOrder.items.length === 0) {

        Toast.show(
            "No items in order",
            "warning"
        );

        return;

    }

    const orderToPrint = state.currentOrder;

    state.orders.push(state.currentOrder);

    if (state.selectedTable) {

        state.selectedTable.currentOrder = null;

    }

    freeTable(state.currentOrder.tableId);

    Toast.show(
        "Payment Successful"
    );

    import("../services/ExportService.js").then(({ printReceipt }) => {

        printReceipt(orderToPrint);

    });

    state.currentOrder = null;

    state.selectedTable = null;

    BillUI.clear();

    TableUI.refresh();

    Storage.saveState(state);

}