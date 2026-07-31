import { CONFIG } from "../core/config.js";
import { state } from "../core/state.js";
import Storage from "../core/storage.js";
import Toast from "../ui/Toast.js";

class SettingsUI {
    render() {
        const appNameInput = document.getElementById("settings-app-name");
        const gstInput = document.getElementById("settings-gst");

        if (appNameInput) {
            appNameInput.value = CONFIG.APP_NAME;
        }
        if (gstInput) {
            gstInput.value = CONFIG.GST_PERCENTAGE;
        }
    }

    initEvents() {
        const saveBtn = document.getElementById("save-settings-btn");
        const resetBtn = document.getElementById("reset-db-btn");

        if (saveBtn) {
            // Remove any existing listeners first
            saveBtn.replaceWith(saveBtn.cloneNode(true));
            const newSaveBtn = document.getElementById("save-settings-btn");

            newSaveBtn.addEventListener("click", () => {
                const appNameInput = document.getElementById("settings-app-name");
                const gstInput = document.getElementById("settings-gst");

                if (appNameInput && gstInput) {
                    const newName = appNameInput.value.trim();
                    const newGst = Number(gstInput.value);

                    if (!newName) {
                        Toast.show("Restaurant Name cannot be empty", "error");
                        return;
                    }

                    if (isNaN(newGst) || newGst < 0 || newGst > 100) {
                        Toast.show("GST Percentage must be between 0 and 100", "error");
                        return;
                    }

                    CONFIG.APP_NAME = newName;
                    CONFIG.GST_PERCENTAGE = newGst;

                    // Update header / logo text
                    const logoText = document.querySelector(".logo h2");
                    if (logoText) logoText.textContent = CONFIG.APP_NAME;

                    // Persist state metadata
                    Storage.saveState(state);
                    Toast.show("Settings Saved Successfully");
                }
            });
        }

        if (resetBtn) {
            resetBtn.replaceWith(resetBtn.cloneNode(true));
            const newResetBtn = document.getElementById("reset-db-btn");

            newResetBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to reset the database? This will clear all tables, custom dishes, orders, and reload the application!")) {
                    Storage.clear();
                    Toast.show("Database Reset. Reloading...", "warning");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            });
        }
    }
}

export default new SettingsUI();
