import TableUI from "../ui/TableUI.js";
import Toast from "../ui/Toast.js";
import BillUI from "../ui/BillUI.js";
import { state } from "../core/state.js";

import {
    selectTable,
    occupyTable,
    addTable,
    deleteTable,
    getTable
} from "../services/TableService.js";

export function initializeTableEvents() {

    const grid = document.querySelector(".tables-grid");

    if (grid) {

        grid.addEventListener("click", (event) => {

            const deleteBtn = event.target.closest(".delete-table-btn");

            if (deleteBtn) {

                event.stopPropagation();

                const id = Number(deleteBtn.dataset.id);

                if (confirm(`Are you sure you want to delete Table ${id}?`)) {

                    const table = getTable(id);

                    if (table && table.status === "Occupied") {

                        Toast.show("Cannot delete an occupied table!", "error");

                        return;

                    }

                    deleteTable(id);

                    if (state.selectedTable && state.selectedTable.id === id) {

                        state.selectedTable = null;

                        state.currentOrder = null;

                        BillUI.clear();

                    }

                    TableUI.refresh();

                    Toast.show(`Table ${id} deleted`, "warning");

                }

                return;

            }

            const card = event.target.closest(".table-card");

            if (!card) return;

            const id = Number(card.dataset.id);

            selectTable(id);

            if (state.selectedTable && Number(state.selectedTable.id) === Number(id)) {

                TableUI.refresh();

                BillUI.render(state.currentOrder);

                Toast.show(`Table ${id} selected`);

            } else {

                Toast.show(`Could not select Table ${id}`, "error");

            }

        });

    }

    const addTableBtn = document.querySelector(".tables-section .primary-btn");

    const tableModal = document.getElementById("table-modal");

    if (addTableBtn && tableModal) {

        addTableBtn.addEventListener("click", () => {

            tableModal.classList.add("active");

        });

        const closeBtns = tableModal.querySelectorAll(".close-modal, .close-modal-btn");

        closeBtns.forEach(btn => {

            btn.addEventListener("click", (e) => {

                e.preventDefault();

                tableModal.classList.remove("active");

            });

        });

        const form = document.getElementById("modal-tableForm");

        if (form) {

            form.addEventListener("submit", (e) => {

                e.preventDefault();

                const capacity = Number(form.capacity.value) || 4;

                addTable(capacity);

                TableUI.refresh();

                tableModal.classList.remove("active");

                form.reset();

                Toast.show(`Table Added with capacity ${capacity}`);

            });

        }

    }

    const filtersContainer = document.querySelector(".table-filters");

    if (filtersContainer) {

        filtersContainer.addEventListener("click", (e) => {

            const btn = e.target.closest(".table-filter-btn");

            if (!btn) return;

            filtersContainer.querySelectorAll(".table-filter-btn").forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            TableUI.refresh();

        });

    }

}