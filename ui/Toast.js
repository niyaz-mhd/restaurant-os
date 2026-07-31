class Toast {

    constructor() {

        this.container = document.createElement("div");

        this.container.className = "toast-container";

        document.body.appendChild(this.container);

    }

    show(message, type = "success") {

        const toast = document.createElement("div");

        toast.className = `toast ${type}`;

        toast.innerHTML = message;

        this.container.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        }, 10);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 2500);

    }

}

export default new Toast();