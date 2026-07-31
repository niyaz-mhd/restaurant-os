import { state } from "../core/state.js";
import Dish from "../models/Dish.js";

class DishService {

    initializeMenu() {

        if (state.dishes.length > 0) return;

        state.dishes = [

            new Dish(
                1,
                "Margherita Pizza",
                12,
                "Pizza",
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
            ),

            new Dish(
                2,
                "Chicken Burger",
                10,
                "Burger",
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
            ),

            new Dish(
                3,
                "French Fries",
                6,
                "Snacks",
                "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500"
            ),

            new Dish(
                4,
                "Coca Cola",
                3,
                "Drinks",
                "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"
            ),

            new Dish(
                5,
                "Pasta Alfredo",
                15,
                "Pasta",
                "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500"
            ),

            new Dish(
                6,
                "Chocolate Cake",
                8,
                "Dessert",
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
            )

        ];

    }

    getAllDishes() {

        return state.dishes;

    }

    getDish(id) {

        return state.dishes.find(dish => dish.id === id);

    }

    search(keyword) {

        return state.dishes.filter(dish =>

            dish.name.toLowerCase().includes(keyword.toLowerCase())

        );

    }

    getByCategory(category) {

        return state.dishes.filter(

            dish => dish.category === category

        );

    }

}

export const dishService = new DishService();

export const {

    initializeMenu,
    getAllDishes,
    getDish,
    search,
    getByCategory

} = dishService;