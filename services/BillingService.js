import { state } from "../core/state.js";
import { CONFIG } from "../core/config.js";

class BillingService {
    constructor() {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (const method of methods) {
            if (method !== "constructor" && typeof this[method] === "function") {
                this[method] = this[method].bind(this);
            }
        }
    }

    calculateSubtotal(items) {

        return items.reduce((sum, item) => {

            return sum + (item.price * item.quantity);

        }, 0);

    }

    calculateGST(subtotal) {

        return subtotal * CONFIG.GST_PERCENTAGE / 100;

    }

    calculateDiscount(subtotal, discount = 0) {

        return subtotal * discount / 100;

    }

    calculateGrandTotal(items, discount = 0) {

        const subtotal = this.calculateSubtotal(items);

        const gst = this.calculateGST(subtotal);

        const discountAmount = this.calculateDiscount(

            subtotal,

            discount

        );

        return {

            subtotal,

            gst,

            discount: discountAmount,

            total:

                subtotal +

                gst -

                discountAmount

        };

    }

    createOrder(tableId) {

        return {

            tableId,

            items: [],

            createdAt: new Date()

        };

    }

    addItem(order, dish) {

        const existing = order.items.find(

            item => item.id === dish.id

        );

        if (existing) {

            existing.quantity++;

            return;

        }

        order.items.push({

            id: dish.id,

            name: dish.name,

            price: dish.price,

            quantity: 1

        });

    }

    removeItem(order, dishId) {

        order.items = order.items.filter(

            item => item.id !== dishId

        );

    }

    increaseQuantity(order, dishId) {

        const item = order.items.find(

            i => i.id === dishId

        );

        if (item) item.quantity++;

    }

    decreaseQuantity(order, dishId) {

        const item = order.items.find(

            i => i.id === dishId

        );

        if (!item) return;

        item.quantity--;

        if (item.quantity <= 0) {

            this.removeItem(order, dishId);

        }

    }

}

export const billingService = new BillingService();

export const {

    calculateSubtotal,
    calculateGST,
    calculateDiscount,
    calculateGrandTotal,
    createOrder,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity

} = billingService;