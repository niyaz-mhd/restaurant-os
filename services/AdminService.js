import { state } from "../core/state.js";
import Dish from "../models/Dish.js";
import Storage from "../core/storage.js";

class AdminService {

    addDish(data) {

        const id = Date.now();

        const dish = new Dish(
            id,
            data.name,
            Number(data.price),
            data.category,
            data.image
        );

        state.dishes.push(dish);

        Storage.saveState(state);

        return dish;
    }

    updateDish(id, updates) {

        const dish = state.dishes.find(d => d.id === id);

        if (!dish) return null;

        Object.assign(dish, updates);

        Storage.saveState(state);

        return dish;
    }

    deleteDish(id) {

        const index = state.dishes.findIndex(
            dish => dish.id === id
        );

        if (index !== -1) {

            state.dishes.splice(index, 1);

            Storage.saveState(state);

        }

    }

    getCategories() {

        return [...new Set(

            state.dishes.map(
                dish => dish.category
            )

        )];

    }

    addCategory(name) {

        if (
            !state.categories.includes(name)
        ) {

            state.categories.push(name);

            Storage.saveState(state);

        }

    }

}

export const adminService = new AdminService();

export const {

    addDish,
    updateDish,
    deleteDish,
    getCategories,
    addCategory

} = adminService;