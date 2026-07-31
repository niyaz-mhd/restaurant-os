import Toast from "../ui/Toast.js";

import AdminUI from "../ui/AdminUI.js";

import {

    addDish,

    updateDish,

    deleteDish

} from "../services/AdminService.js";

export function initializeAdminEvents() {

    // Add Dish

    document.addEventListener(

        "submit",

        event => {

            if (

                !event.target.matches("#dishForm")

            ) return;

            event.preventDefault();

            const form = event.target;

            addDish({

                name: form.name.value,

                price: form.price.value,

                category: form.category.value,

                image: form.image.value

            });

            Toast.show(

                "Dish Added"

            );

            form.reset();

            AdminUI.refresh();

        }

    );

    // Delete Dish

    document.addEventListener(

        "click",

        event => {

            if (

                !event.target.matches(".delete-dish")

            ) return;

            const id = Number(

                event.target.dataset.id

            );

            deleteDish(id);

            Toast.show(

                "Dish Deleted",

                "warning"

            );

            AdminUI.refresh();

        }

    );

    // Edit Dish (Modal)

    document.addEventListener(

        "click",

        event => {

            const btn = event.target.closest(".edit-dish");

            if (!btn) return;

            const id = Number(btn.dataset.id);

            import("../services/DishService.js").then(({ getDish }) => {

                const dish = getDish(id);

                if (!dish) return;

                const modal = document.getElementById("dish-modal");

                const form = document.getElementById("modal-dishForm");

                if (modal && form) {

                    form.id.value = dish.id;

                    form.name.value = dish.name;

                    form.price.value = dish.price;

                    form.category.value = dish.category;

                    form.image.value = dish.image;

                    document.getElementById("dish-modal-title").textContent = "Edit Menu Item";

                    modal.classList.add("active");

                }

            });

        }

    );

    // Modal Form Close and Submit binding

    const modal = document.getElementById("dish-modal");

    if (modal) {

        const closeBtns = modal.querySelectorAll(".close-modal, .close-modal-btn");

        closeBtns.forEach(btn => {

            btn.addEventListener("click", (e) => {

                e.preventDefault();

                modal.classList.remove("active");

            });

        });

        const form = document.getElementById("modal-dishForm");

        if (form) {

            form.addEventListener("submit", (e) => {

                e.preventDefault();

                const id = Number(form.id.value);

                const data = {

                    name: form.name.value,

                    price: Number(form.price.value),

                    category: form.category.value,

                    image: form.image.value

                };

                if (id) {

                    updateDish(id, data);

                    Toast.show("Dish Updated Successfully");

                } else {

                    addDish(data);

                    Toast.show("Dish Added Successfully");

                }

                modal.classList.remove("active");

                form.reset();

                AdminUI.refresh();

            });

        }

    }

}