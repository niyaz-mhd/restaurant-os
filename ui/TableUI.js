import { getTables } from "../services/TableService.js";
import { state } from "../core/state.js";

class TableUI {

    constructor() {

        this.container = document.querySelector(".tables-grid");

    }

    render() {

        if (!this.container) {

            this.container = document.querySelector(".tables-grid");

        }

        if (!this.container) return;

        this.container.innerHTML = "";

        const activeFilterBtn = document.querySelector(".table-filter-btn.active");

        const statusFilter = activeFilterBtn ? activeFilterBtn.dataset.status : "all";

        const tables = getTables();

        const filteredTables = statusFilter === "all" 

            ? tables 

            : tables.filter(t => t.status === statusFilter);

        filteredTables.forEach(table => {

            this.container.appendChild(

                this.createCard(table)

            );

        });

    }

    createCard(table) {

        const card = document.createElement("div");

        const isSelected = state.selectedTable && Number(state.selectedTable.id) === Number(table.id);

        card.className = `table-card${isSelected ? " selected" : ""}`;

        card.dataset.id = table.id;

        let statusClass = "available";

        if (table.status === "Occupied")
            statusClass = "occupied";

        if (table.status === "Reserved")
            statusClass = "reserved";

        card.innerHTML = `

            <button class="delete-table-btn" data-id="${table.id}" title="Delete Table">

                <i class="fa-solid fa-xmark"></i>

            </button>

            <i class="fa-solid fa-table table-card-icon"></i>

            <h3>${table.name}</h3>

            <span class="status ${statusClass}">

                ${table.status}

            </span>

            <p style="font-size: 11px; margin-top: 4px; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">

                <i class="fa-solid fa-user-group" style="font-size: 9px; opacity: 0.6;"></i>

                ${table.capacity} Seats

            </p>

            <button class="select-table-btn ${isSelected ? 'active' : ''}" data-id="${table.id}">
                ${isSelected ? 'Selected' : 'Select'}
            </button>

        `;

        return card;

    }

    refresh() {

        this.render();

    }

}

export default new TableUI();