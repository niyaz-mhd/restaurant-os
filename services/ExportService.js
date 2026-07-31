import { CONFIG } from "../core/config.js";

class ExportService {

    printReceipt(order) {

        const win = window.open("", "_blank");

        if (!win) return;

        const dateStr = new Date(order.createdAt || new Date()).toLocaleString();

        const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const gstAmount = subtotal * CONFIG.GST_PERCENTAGE / 100;

        const discountAmount = subtotal * (order.discountPercent || 0) / 100;

        let html = `

        <html>

        <head>

            <title>Receipt - ${CONFIG.APP_NAME}</title>

            <style>

                body {

                    font-family: 'Courier New', Courier, monospace;

                    width: 300px;

                    margin: 0 auto;

                    padding: 20px;

                    color: #000;

                    background: #fff;

                    font-size: 14px;

                }

                .text-center { text-align: center; }

                .text-right { text-align: right; }

                .divider { border-top: 1px dashed #000; margin: 10px 0; }

                .header-title { font-size: 20px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }

                table { width: 100%; border-collapse: collapse; margin: 15px 0; }

                th { text-align: left; border-bottom: 1px solid #000; padding-bottom: 5px; }

                td { padding: 4px 0; }

                .totals-table td { padding: 2px 0; }

                .grand-total { font-size: 16px; font-weight: bold; }

                .footer-msg { font-size: 12px; margin-top: 25px; }

            </style>

        </head>

        <body>

            <div class="text-center">

                <div class="header-title">${CONFIG.APP_NAME}</div>

                <div>Receipt / Tax Invoice</div>

                <div class="divider"></div>

                <div style="font-size: 12px; text-align: left;">

                    <div>Date: ${dateStr}</div>

                    <div>Table: ${order.tableId}</div>

                </div>

            </div>

            <div class="divider"></div>

            <table>

                <thead>

                    <tr>

                        <th>Item</th>

                        <th class="text-center">Qty</th>

                        <th class="text-right">Price</th>

                    </tr>

                </thead>

                <tbody>

        `;

        order.items.forEach(item => {

            html += `

                <tr>

                    <td>${item.name}</td>

                    <td class="text-center">${item.quantity}</td>

                    <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>

                </tr>

            `;

        });

        html += `

                </tbody>

            </table>

            <div class="divider"></div>

            <table class="totals-table">

                <tr>

                    <td>Subtotal:</td>

                    <td class="text-right">$${subtotal.toFixed(2)}</td>

                </tr>

                <tr>

                    <td>GST (${CONFIG.GST_PERCENTAGE}%):</td>

                    <td class="text-right">$${gstAmount.toFixed(2)}</td>

                </tr>

        `;

        if (order.discountPercent > 0) {

            html += `

                <tr>

                    <td>Discount (${order.discountPercent}%):</td>

                    <td class="text-right">-$${discountAmount.toFixed(2)}</td>

                </tr>

            `;

        }

        html += `

                <tr class="grand-total">

                    <td>Grand Total:</td>

                    <td class="text-right">$${Number(order.total).toFixed(2)}</td>

                </tr>

            </table>

            <div class="divider"></div>

            <div class="text-center footer-msg">

                Thank you for your visit!<br>

                Please come again.

            </div>

        </body>

        </html>

        `;

        win.document.write(html);

        win.document.close();

        win.print();

    }

    exportJSON() {

        const data = JSON.stringify(localStorage, null, 2);

        const blob = new Blob(

            [data],

            { type: "application/json" }

        );

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "restaurant-data.json";

        link.click();
    }

}

export const exportService = new ExportService();

export const {

    printReceipt,
    exportJSON

} = exportService;