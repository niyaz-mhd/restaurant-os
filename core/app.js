import { initializeTables } from "../services/TableService.js";

import { initializeMenu } from "../services/DishService.js";

import TableUI from "../ui/TableUI.js";

import ProductUI from "../ui/ProductUI.js";

import { initializeTableEvents } from "../events/tableEvents.js";

import { initializeProductEvents } from "../events/productEvents.js";

import { initializeBillEvents } from "../events/billEvents.js";

import { initializeAdminEvents } from "../events/adminEvents.js";

import { initializeNavigationEvents } from "../events/navigationEvents.js";

import Storage from "./storage.js";

import { state } from "./state.js";

import { CONFIG } from "./config.js";

function initializeApplication() {

    console.log("RestaurantOS Started");

    const database = Storage.load();

    if (database) {

        console.log("Existing database found.");

        if (database.config) {

            CONFIG.APP_NAME = database.config.APP_NAME || CONFIG.APP_NAME;

            CONFIG.GST_PERCENTAGE = database.config.GST_PERCENTAGE ?? CONFIG.GST_PERCENTAGE;

        }

        const logoText = document.querySelector(".logo h2");

        if (logoText) {

            logoText.textContent = CONFIG.APP_NAME;

        }

        state.tables = database.tables || [];

        state.dishes = database.dishes || [];

        state.orders = database.orders || [];

        state.categories = database.categories || [];

        state.statistics = database.statistics || {

            totalSales: 0,

            totalOrders: 0,

            occupiedTables: 0

        };

    }

    initializeTables();

    initializeMenu();

    if (!database) {

        console.log("Creating new database.");

        Storage.saveState(state);

    }

    TableUI.render();

    ProductUI.render();

    initializeTableEvents();

    initializeProductEvents();

    initializeBillEvents();

    initializeAdminEvents();

    initializeNavigationEvents();

}

window.addEventListener(

    "DOMContentLoaded",

    initializeApplication

);
