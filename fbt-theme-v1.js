export async function calculateTotalPrice(products, widgetElement) {
    let totalPrice = 0;
    let anyCheckboxChecked = false;
    if (widgetElement) {
        const productList = widgetElement.querySelectorAll(`.sf-product-item`);
        productList.forEach((productItem) => {
            var _a, _b, _c, _d, _e, _f;
            const checkbox = productItem.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                anyCheckboxChecked = true;
                let productRef = products;
                let productId = productItem.getAttribute("data-product-id");
                let product = productRef.find((product) => Number(product.id) === Number(productId));
                let selectedIndex = (_a = productItem === null || productItem === void 0 ? void 0 : productItem.querySelector(".sf-product-variants-dropdown")) === null || _a === void 0 ? void 0 : _a.selectedIndex;
                let price = (_d = (_c = (_b = product === null || product === void 0 ? void 0 : product.variants) === null || _b === void 0 ? void 0 : _b[selectedIndex]) === null || _c === void 0 ? void 0 : _c.variant_price) !== null && _d !== void 0 ? _d : (_f = (_e = product === null || product === void 0 ? void 0 : product.variants) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.variant_price;
                if (price)
                    totalPrice += price;
            }
        });
        const formattedTotalPrice = anyCheckboxChecked
            ? totalPrice.toFixed(2)
            : "0.00";
        const totalPriceText = widgetElement.querySelector('.sf-total-price[data-tag="total-price"]');
        firstItemPrice(products, widgetElement).then((firstItemPr) => {
            if (widgetElement) {
                const addOnElement = widgetElement.querySelector(".sf-add-on-product");
                if (addOnElement) {
                    addOnElement.innerHTML = `${products.length - 1} Add-ons`;
                }
                // checkboxTriggered(products, doc)
                const addOnPrice = widgetElement.querySelector(".sf-add-on-product-price");
                const thisPrice = widgetElement.querySelector('.sf-this-product-price');
                if (thisPrice && firstItemPr) {
                    thisPrice.innerHTML = `$  ${firstItemPr}`;
                }
                if (addOnPrice) {
                    if (firstItemPr !== undefined) {
                        addOnPrice.innerHTML = `$  ${(totalPrice - firstItemPr).toFixed(2)}
              `;
                    }
                }
            }
        });
        if (totalPriceText) {
            totalPriceText.innerHTML = `${'$' + formattedTotalPrice}`;
            return true;
        }
    }
}
export async function checkboxTriggered(products, widgetElement) {
    // Function to calculate the number of checked products
    const updateCheckedCount = () => {
        const checkboxes = widgetElement.querySelectorAll(".sf-product-checkbox");
        let checkedCount = -1;
        checkboxes.forEach((checkbox) => {
            const productItem = checkbox.closest(".sf-product-item");
            if (!productItem)
                return;
            const productImage = productItem.querySelector(".sf-product-image");
            const productDropdown = productItem.querySelector(".sf-product-variants-dropdown");
            const productTitle = productItem.querySelector(".sf-product-title");
            const productPrice = productItem.querySelector(".sf-price-container");
            const checkboxInput = checkbox;
            if (productImage) {
                productImage.style.opacity = checkboxInput.checked ? "1" : "0.5";
            }
            if (productDropdown) {
                productDropdown.style.opacity = checkboxInput.checked ? "1" : "0.5";
            }
            if (productTitle) {
                productTitle.style.opacity = checkboxInput.checked ? "1" : "0.5";
            }
            if (productPrice) {
                productPrice.style.opacity = checkboxInput.checked ? "1" : "0.5";
            }
            if (checkboxInput.checked) {
                checkedCount++;
            }
        });
        const addOnElement = widgetElement.querySelector(".sf-add-on-product");
        if (addOnElement) {
            const addOnText = checkedCount <= 1 ? "Add-on" : "Add-ons";
            addOnElement.innerHTML = `${checkedCount} ${addOnText}`;
        }
        calculateTotalPrice(products, widgetElement);
        fbtTablePriceCalculator(products, widgetElement);
    };
    updateCheckedCount();
    // Event listener for change events
    widgetElement.addEventListener("change", updateCheckedCount);
}
export async function fbtTablePriceCalculator(products, widgetElement) {
    let totalPrice = 0;
    let anyCheckboxChecked = false;
    if (widgetElement) {
        const productList = widgetElement.querySelector(`ul.sf-product-list`);
        const checkboxes = productList === null || productList === void 0 ? void 0 : productList.querySelectorAll('input[type="checkbox"]');
        checkboxes === null || checkboxes === void 0 ? void 0 : checkboxes.forEach((checkbox) => {
            var _a, _b, _c, _d, _e, _f;
            if (checkbox && checkbox.checked) {
                anyCheckboxChecked = true;
                const productId = checkbox.getAttribute("id");
                const productItem = widgetElement.querySelector(`.sf-product-grid .sf-product-item[data-product-id="${productId}"]`);
                let productRef = products;
                let product = productRef.find((product) => Number(product.id) === Number(productId));
                let selectedIndex = (_a = productItem === null || productItem === void 0 ? void 0 : productItem.querySelector(".sf-product-variants-dropdown")) === null || _a === void 0 ? void 0 : _a.selectedIndex;
                let price = (_d = (_c = (_b = product === null || product === void 0 ? void 0 : product.variants) === null || _b === void 0 ? void 0 : _b[selectedIndex]) === null || _c === void 0 ? void 0 : _c.variant_price) !== null && _d !== void 0 ? _d : (_f = (_e = product === null || product === void 0 ? void 0 : product.variants) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.variant_price;
                if (price)
                    totalPrice += price;
            }
        });
        if (productList) {
            const formattedTotalPrice = anyCheckboxChecked
                ? totalPrice.toFixed(2)
                : "0.00";
            const totalPriceText = widgetElement.querySelector('.sf-total-price[data-tag="total-price"]');
            if (totalPriceText)
                totalPriceText.innerHTML = `<strong>Total Price:</strong>${'$' + formattedTotalPrice}`;
        }
    }
}
export async function disableCheckbox(widgetElement) {
    if (widgetElement) {
        const firstProductElement = widgetElement.querySelector(".sf-product-item");
        let checkbox = firstProductElement === null || firstProductElement === void 0 ? void 0 : firstProductElement.querySelector(".sf-product-checkbox");
        if (checkbox === null) {
            const tableProduct = widgetElement.querySelector(".sf-product-list");
            checkbox = tableProduct === null || tableProduct === void 0 ? void 0 : tableProduct.querySelector(".sf-product-checkbox");
        }
        if (checkbox) {
            checkbox.disabled = true;
            checkbox.style.cursor = "not-allowed";
        }
    }
}
export async function firstItemPrice(products, widgetElement) {
    var _a, _b, _c, _d, _e, _f;
    if (widgetElement) {
        const firstProductElement = widgetElement.querySelector(".sf-product-item");
        const selectedIndex = (_a = firstProductElement === null || firstProductElement === void 0 ? void 0 : firstProductElement.querySelector(".sf-product-variants-dropdown")) === null || _a === void 0 ? void 0 : _a.selectedIndex;
        const productId = firstProductElement.getAttribute("data-product-id");
        let productRef = products;
        let product = productRef.find((product) => Number(product.id) === Number(productId));
        return ((_d = (_c = (_b = product === null || product === void 0 ? void 0 : product.variants) === null || _b === void 0 ? void 0 : _b[selectedIndex]) === null || _c === void 0 ? void 0 : _c.variant_price) !== null && _d !== void 0 ? _d : (_f = (_e = product === null || product === void 0 ? void 0 : product.variants) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.variant_price);
    }
    return undefined;
}
export async function fbtTableVariant(widgetElement, mainProductId, selectedIndex, currencyRate, currencySymbol, products) {
    const productListElement = widgetElement.querySelector("ul.sf-product-list");
    if (!productListElement)
        return;
    let productRef = products;
    let product = productRef.find((product) => product.id === mainProductId);
    const selectedVariant = product === null || product === void 0 ? void 0 : product.variants[selectedIndex];
    const variantElement = productListElement.querySelector(`[data-product-id="${mainProductId}"]`);
    const priceElement = variantElement === null || variantElement === void 0 ? void 0 : variantElement.querySelector('[data-tag="price"]');
    if (priceElement) {
        const currentPrice = selectedVariant.variant_price * currencyRate;
        if (variantElement &&
            variantElement.querySelector(`[data-tag="on-sale"]`)) {
            return;
        }
        priceElement.textContent = `${currencySymbol}${currentPrice.toFixed(2)}`;
    }
}
export async function fbtTableUtils(widgetElement) {
    if (widgetElement) {
        const productListElement = widgetElement.querySelector("ul.sf-product-list");
        if (!productListElement)
            return;
        const firstLiElement = productListElement.querySelector("li:first-child");
        if (!firstLiElement)
            return;
        const productNameSpan = firstLiElement.querySelector(".sf-product-title");
        if (productNameSpan) {
            productNameSpan.innerHTML = `<strong>This item:</strong> ${productNameSpan.innerHTML}`;
        }
        const checkbox = firstLiElement.querySelector(".sf-product-checkbox");
        if (checkbox instanceof HTMLInputElement) {
            checkbox.disabled = true;
            checkbox.style.cursor = "not-allowed";
        }
    }
}
export function fbtProductView(products) {
    const embeddedElement = document.getElementById('sf-viewport-box');
    console.log('embeddedElement');
    let doc;
    function handleIframeLoad() {
        doc = embeddedElement.contentDocument;
        if (doc) {
            renderFbt(doc);
        }
    }
    if (embeddedElement) {
        embeddedElement.onload = handleIframeLoad;
        if (embeddedElement.contentDocument.readyState === 'complete') {
            handleIframeLoad();
        }
    }
    function renderFbt(doc) {
        const widgetElement = doc.querySelector('.sf-container');
        calculateTotalPrice(products, widgetElement);
        disableCheckbox(widgetElement);
        fbtTableUtils(widgetElement);
        fbtTablePriceCalculator(products, widgetElement);
    }
}
