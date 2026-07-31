import { state } from "../core/state.js";

import Toast from "../ui/Toast.js";

import BillUI from "../ui/BillUI.js";

import Storage from "../core/storage.js";

import {
    getDish
} from "../services/DishService.js";

import {
    createOrder,
    addItem,
    calculateGrandTotal
} from "../services/BillingService.js";

import { occupyTable } from "../services/TableService.js";

import TableUI from "../ui/TableUI.js";

export function initializeProductEvents() {

    const grid = document.querySelector(".products-grid");

    if (!grid) return;

    grid.addEventListener("click", (event) => {

        const button = event.target.closest(".add-btn");

        if (!button) return;

        if (!state.selectedTable) {

            Toast.show(
                "Select a table first",
                "warning"
            );

            return;

        }

        if (!state.currentOrder) {

            state.currentOrder = createOrder(
                state.selectedTable.id
            );

            state.selectedTable.currentOrder = state.currentOrder;

        }

        if (state.selectedTable.status !== "Occupied") {

            occupyTable(state.selectedTable.id);

            TableUI.refresh();

        }

        const dish = getDish(
            Number(button.dataset.id)
        );

        addItem(
            state.currentOrder,
            dish
        );

        const totals = calculateGrandTotal(
            state.currentOrder.items
        );

        state.currentOrder.total = totals.total;

        BillUI.render(state.currentOrder);

        Storage.saveState(state);

        Toast.show(`${dish.name} added`);

    });

}