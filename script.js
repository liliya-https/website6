document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calculatorForm");
    const quantity = document.getElementById("quantity");
    const optionField = document.getElementById("optionField");
    const optionSelect = document.getElementById("option");
    const propertyField = document.getElementById("propertyField");
    const propertyCheckbox = document.getElementById("property");
    const result = document.getElementById("result");
    const totalPrice = document.getElementById("totalPrice");
    const resultMessage = document.getElementById("resultMessage");

    const quantityPattern = /^[1-9]\d*$/;

    function getPrice(element) {
        return Number(element.getAttribute("data-price"));
    }

    function showError(message) {
        totalPrice.textContent = "—";
        resultMessage.textContent = message;
        result.classList.add("result-error");
    }

    function updateFieldsVisibility(productType) {
        optionField.hidden = productType !== "notebook";
        propertyField.hidden = productType !== "folder";

        if (productType !== "folder") {
            propertyCheckbox.checked = false;
        }
    }

    function calculate() {
        const product = form.querySelector("input[name='product']:checked");
        const quantityText = quantity.value.trim();
        let unitPrice = getPrice(product);
        let count = 0;
        let total = 0;

        updateFieldsVisibility(product.value);
        result.classList.remove("result-error");

        if (!quantityPattern.test(quantityText)) {
            showError("Введите целое число больше нуля, например 3.");
            return;
        }

        count = Number(quantityText);

        if (!Number.isSafeInteger(count)) {
            showError("Количество слишком большое. Введите меньшее число.");
            return;
        }

        if (product.value === "notebook") {
            unitPrice += getPrice(
                optionSelect.options[optionSelect.selectedIndex]
            );
        }

        if (product.value === "folder" && propertyCheckbox.checked) {
            unitPrice += getPrice(propertyCheckbox);
        }

        total = unitPrice * count;

        if (!Number.isSafeInteger(total)) {
            showError("Итоговая сумма слишком большая. Уменьшите количество.");
            return;
        }

        totalPrice.textContent = total.toLocaleString("ru-RU") + " ₽";
        resultMessage.textContent =
                unitPrice.toLocaleString("ru-RU") + " ₽ × " +
                count.toLocaleString("ru-RU") + " шт. = " +
                total.toLocaleString("ru-RU") + " ₽";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    quantity.addEventListener("input", calculate);
    optionSelect.addEventListener("change", calculate);
    propertyCheckbox.addEventListener("change", calculate);

    form.querySelectorAll("input[name='product']").forEach(
        function (radio) {
            radio.addEventListener("change", calculate);
        }
    );

    calculate();
});