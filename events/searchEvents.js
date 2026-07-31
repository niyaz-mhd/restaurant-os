import ProductUI from "../ui/ProductUI.js";

import {
    search
} from "../services/DishService.js";

export function initializeSearchEvents() {

    const input =
        document.querySelector(".search input");

    if (!input) return;

    input.addEventListener("input", () => {

        const keyword = input.value.trim();

        if (keyword === "") {

            ProductUI.render();

            return;

        }

        ProductUI.render(

            search(keyword)

        );

    });

}