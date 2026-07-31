import { state } from "../core/state.js";
import { CONFIG } from "../core/config.js";
import Table from "../models/Table.js";
import Storage from "../core/storage.js";

class TableService {
    constructor() {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (const method of methods) {
            if (method !== "constructor" && typeof this[method] === "function") {
                this[method] = this[method].bind(this);
            }
        }
    }

    initializeTables() {

        if (state.tables.length > 0) return;

        for (let i = 1; i <= CONFIG.TABLES; i++) {

            state.tables.push(new Table(i));

        }

    }

    getTables() {

        return state.tables;

    }

    getTable(id) {

        return state.tables.find(table => Number(table.id) === Number(id));

    }

    selectTable(id) {

        const table = this.getTable(id);

        if (!table) return;

        state.selectedTable = table;

        state.currentOrder = table.currentOrder || null;

    }

    occupyTable(id) {

        const table = this.getTable(id);

        if (table) {

            table.status = "Occupied";

            Storage.saveState(state);

        }

    }

    freeTable(id) {

        const table = this.getTable(id);

        if (table) {

            table.status = "Available";

            Storage.saveState(state);

        }

    }

    reserveTable(id) {

        const table = this.getTable(id);

        if (table) {

            table.status = "Reserved";

            Storage.saveState(state);

        }

    }

    addTable(capacity = 4) {

        const nextId = state.tables.length > 0 ? Math.max(...state.tables.map(t => t.id)) + 1 : 1;

        const newTable = new Table(nextId);

        newTable.capacity = capacity;

        state.tables.push(newTable);

        Storage.saveState(state);

        return newTable;

    }

    deleteTable(id) {

        const index = state.tables.findIndex(t => Number(t.id) === Number(id));

        if (index !== -1) {

            state.tables.splice(index, 1);

            Storage.saveState(state);

            return true;

        }

        return false;

    }

}

export const tableService = new TableService();

export const {

    initializeTables,
    getTables,
    getTable,
    selectTable,
    occupyTable,
    freeTable,
    reserveTable,
    addTable,
    deleteTable

} = tableService;