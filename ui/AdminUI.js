import { getAllDishes } from "../services/DishService.js";
import ProductUI from "./ProductUI.js";

class AdminUI {
    render() {
        const container = document.getElementById("admin-dishes-list");
        if (!container) return;

        container.innerHTML = "";
        const dishes = getAllDishes();

        if (dishes.length === 0) {
            container.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--light-text);">No dishes available. Add one below or reset to defaults in settings.</td></tr>`;
            return;
        }

        dishes.forEach(dish => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><img src="${dish.image}" alt="${dish.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
                <td><strong>${dish.name}</strong></td>
                <td><span style="background: #f1f2f6; padding: 4px 8px; border-radius: 12px; font-size: 12px;">${dish.category}</span></td>
                <td>$${dish.price.toFixed(2)}</td>
                <td>
                    <button class="primary-btn edit-dish" data-id="${dish.id}" style="padding: 6px 12px; font-size: 13px; background: var(--accent); margin-right: 5px;">
                        Edit
                    </button>
                    <button class="primary-btn delete-dish" data-id="${dish.id}" style="padding: 6px 12px; font-size: 13px; background: var(--danger);">
                        Delete
                    </button>
                </td>
            `;
            container.appendChild(tr);
        });
    }

    refresh() {
        this.render();
        // Also refresh the POS menu grid
        ProductUI.render();
    }
}

export default new AdminUI();
