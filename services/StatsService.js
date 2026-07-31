import { state } from "../core/state.js";

class StatsService {

    totalRevenue() {

        return state.orders.reduce(

            (sum, order) => sum + order.total,

            0

        );

    }

    totalOrders() {

        return state.orders.length;

    }

    occupiedTables() {

        return state.tables.filter(

            table => table.status === "Occupied"

        ).length;

    }

    availableTables() {

        return state.tables.filter(

            table => table.status === "Available"

        ).length;

    }

    reservedTables() {

        return state.tables.filter(

            table => table.status === "Reserved"

        ).length;

    }

    popularDishes() {

        const counter = {};

        state.orders.forEach(order => {

            order.items.forEach(item => {

                if (!counter[item.name]) {

                    counter[item.name] = 0;

                }

                counter[item.name] += item.quantity;

            });

        });

        return Object.entries(counter)

            .sort((a, b) => b[1] - a[1])

            .slice(0, 5);

    }

}

export const statsService = new StatsService();

export const {

    totalRevenue,
    totalOrders,
    occupiedTables,
    availableTables,
    reservedTables,
    popularDishes

} = statsService;