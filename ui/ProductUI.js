import { getAllDishes } from "../services/DishService.js";

class ProductUI {

    constructor() {

        this.container = document.querySelector(".products-grid");

    }

    renderCategories() {

        const catContainer = document.querySelector(".category-tabs");

        if (!catContainer) return;

        import("../services/DishService.js").then(({ getAllDishes }) => {

            const dishes = getAllDishes();

            const categories = ["all", ...new Set(dishes.map(dish => dish.category))];

            const activeTab = catContainer.querySelector(".category-btn.active");

            const activeCategory = activeTab ? activeTab.dataset.category : "all";

            catContainer.innerHTML = "";

            categories.forEach(cat => {

                const btn = document.createElement("button");

                btn.className = `category-btn${cat === activeCategory ? " active" : ""}`;

                btn.dataset.category = cat;

                btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);

                catContainer.appendChild(btn);

            });

        });

    }

    render(products = null) {

        if (!this.container) {

            this.container = document.querySelector(".products-grid");

        }

        if (!this.container) return;

        this.container.innerHTML = "";

        const dishes = products || getAllDishes();

        dishes.forEach(dish => {

            this.container.appendChild(

                this.createCard(dish)

            );

        });

        this.renderCategories();

    }

    createCard(dish) {

        const card = document.createElement("div");

        card.className = "product-card";

        card.dataset.id = dish.id;

        card.innerHTML = `

            <img
            src="${dish.image}"
            class="product-image">

            <div class="product-content">

                <h3>${dish.name}</h3>

                <p>${dish.category}</p>

                <div class="price">

                    <span>$${dish.price}</span>

                    <button
                    class="add-btn"
                    data-id="${dish.id}">

                        Add

                    </button>

                </div>

            </div>

        `;

        return card;

    }

    refresh(products) {

        this.render(products);

    }

}

export default new ProductUI();