import { CONFIG } from "./config.js";

class Storage {

    load() {

        const data = localStorage.getItem(CONFIG.STORAGE_KEY);

        return data ? JSON.parse(data) : null;

    }

    save(data) {

        localStorage.setItem(

            CONFIG.STORAGE_KEY,

            JSON.stringify(data)

        );

    }

    saveState(state) {

        const data = {

            tables: state.tables,

            dishes: state.dishes,

            orders: state.orders,

            categories: state.categories,

            statistics: state.statistics,

            config: {

                APP_NAME: CONFIG.APP_NAME,

                GST_PERCENTAGE: CONFIG.GST_PERCENTAGE

            },

            initialized: true

        };

        this.save(data);

    }

    clear() {

        localStorage.removeItem(CONFIG.STORAGE_KEY);

    }

}

export default new Storage();