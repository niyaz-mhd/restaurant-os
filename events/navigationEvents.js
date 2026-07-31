import DashboardUI from "../ui/DashboardUI.js";
import TableUI from "../ui/TableUI.js";
import ProductUI from "../ui/ProductUI.js";
import AdminUI from "../ui/AdminUI.js";
import OrdersUI from "../ui/OrdersUI.js";
import AnalyticsUI from "../ui/AnalyticsUI.js";
import SettingsUI from "../ui/SettingsUI.js";
import Toast from "../ui/Toast.js";

export function initializeNavigationEvents() {
    const navLinks = document.querySelectorAll(".sidebar nav a");
    const views = document.querySelectorAll(".view-section");
    const container = document.querySelector(".container");

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Hide all views
            views.forEach(v => v.classList.remove("active"));

            // Determine target view based on text content
            const text = link.textContent.trim().toLowerCase();
            let targetViewId = "dashboard-view";

            if (text.includes("dashboard")) {
                targetViewId = "dashboard-view";
                DashboardUI.render();
            } else if (text.includes("tables")) {
                targetViewId = "pos-view";
                TableUI.render();
                ProductUI.render();
            } else if (text.includes("menu")) {
                targetViewId = "menu-manage-view";
                AdminUI.render();
            } else if (text.includes("orders")) {
                targetViewId = "orders-view";
                OrdersUI.render();
            } else if (text.includes("analytics")) {
                targetViewId = "analytics-view";
                AnalyticsUI.render();
            } else if (text.includes("settings")) {
                targetViewId = "settings-view";
                SettingsUI.render();
            }

            const targetView = document.getElementById(targetViewId);
            if (targetView) {
                targetView.classList.add("active");
            }

            // Show or hide Bill Panel (only show on pos-view / Active Orders)
            if (targetViewId === "pos-view") {
                container.classList.remove("no-bill");
            } else {
                container.classList.add("no-bill");
            }
        });
    });

    // Initialize Theme toggle
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (themeToggleBtn) {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            document.body.classList.add("dark-theme");
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }

        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            themeToggleBtn.innerHTML = isDark 
                ? '<i class="fa-solid fa-sun"></i>' 
                : '<i class="fa-solid fa-moon"></i>';
            Toast.show(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`);
        });
    }

    // Category Tabs click binding
    const categoryTabsContainer = document.querySelector(".category-tabs");
    if (categoryTabsContainer) {
        categoryTabsContainer.addEventListener("click", (e) => {
            const tab = e.target.closest(".category-btn");
            if (!tab) return;

            categoryTabsContainer.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            tab.classList.add("active");

            const category = tab.dataset.category;
            import("../services/DishService.js").then(({ getAllDishes, getByCategory }) => {
                const dishes = category === "all" ? getAllDishes() : getByCategory(category);
                ProductUI.render(dishes);
            });
        });
    }

    // Initialize the default view (Dashboard)
    DashboardUI.render();
    SettingsUI.initEvents();
    container.classList.add("no-bill");

    // Listen to orders table print clicks
    const ordersView = document.getElementById("orders-view");
    if (ordersView) {
        ordersView.addEventListener("click", (e) => {
            const printBtn = e.target.closest(".print-order-btn");
            if (printBtn) {
                const orderTime = printBtn.dataset.orderTime;
                import("../core/state.js").then(({ state }) => {
                    const order = state.orders.find(o => o.createdAt === orderTime || new Date(o.createdAt).toISOString() === orderTime || new Date(o.createdAt).getTime() === new Date(orderTime).getTime());
                    if (order) {
                        import("../services/ExportService.js").then(({ printReceipt }) => {
                            printReceipt(order);
                        });
                    }
                });
            }
        });
    }

    // Bind JSON export button
    const exportBtn = document.getElementById("export-json-btn");
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            import("../services/ExportService.js").then(({ exportJSON }) => {
                exportJSON();
            });
        });
    }
}
