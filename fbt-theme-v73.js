async function calculateTotalPrice(products, widgetElement,currency,totalPriceText) {
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
      const totalPriceTextValue = widgetElement.querySelector('.sf-total-price[data-tag="total-price"]');
      firstItemPrice(products, widgetElement).then((firstItemPr) => {
          if (widgetElement) {
              const addOnPrice = widgetElement.querySelector(".sf-add-on-product-price");
              const thisPrice = widgetElement.querySelector('.sf-this-product-price');
              if (thisPrice && firstItemPr) {
                  thisPrice.innerHTML = `${currency}  ${firstItemPr}`;
              }
              if (addOnPrice) {
                  if (firstItemPr !== undefined) {
                      addOnPrice.innerHTML = `${currency}  ${(totalPrice - firstItemPr).toFixed(2)}
            `;
                  }
              }
          }
      });
      if (totalPriceTextValue) {
          totalPriceTextValue.innerHTML = ` ${totalPriceText} : ${currency + formattedTotalPrice}`;
          return true;
      }
  }
}
async function cartButtonText(widgetElement, checkboxCount) {
  const multiCartElement = widgetElement === null || widgetElement === void 0 ? void 0 : widgetElement.querySelector(".sf-multi-cart");
  const twoCartElement = widgetElement === null || widgetElement === void 0 ? void 0 : widgetElement.querySelector(".sf-two-cart");
  const singleCartElement = widgetElement === null || widgetElement === void 0 ? void 0 : widgetElement.querySelector(".sf-single-cart");
  if (checkboxCount === 2) {
      if (twoCartElement)
          twoCartElement.style.display = "block";
      if (multiCartElement)
          multiCartElement.style.display = "none";
      if (singleCartElement)
          singleCartElement.style.display = "none";
  }
  else if (checkboxCount === 1) {
      if (twoCartElement)
          twoCartElement.style.display = "none";
      if (multiCartElement)
          multiCartElement.style.display = "none";
      if (singleCartElement)
          singleCartElement.style.display = "block";
  }
  else {
      if (twoCartElement)
          twoCartElement.style.display = "none";
      if (multiCartElement)
          multiCartElement.style.display = "block";
      if (singleCartElement)
          singleCartElement.style.display = "none";
  }
}

async function checkboxTriggered(products, widgetElement,currency) {
  // Function to calculate the number of checked products
  const updateCheckedCount = () => {
      const checkboxes = widgetElement.querySelectorAll(".sf-product-checkbox");
      console.log(checkboxes)
      let checkedCount = -1;
      checkboxes.forEach((checkbox) => {
          const productItem = checkbox.closest(".sf-product-item , .sf-product-list-item ");
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
        console.log(checkedCount,'dsd',checkboxes.length -1)
    
      if(  checkedCount < (checkboxes.length - 1))
      {
        const discountTextElements = widgetElement.getElementsByClassName('sf-discount-text');
        for (let i = 0; i < discountTextElements.length; i++) {
              discountTextElements[i].style.display = 'none';
          }

      }
        else if(checkedCount === -1){
          const addOnElement = widgetElement.querySelector(".sf-add-on-product-price");
      if (addOnElement) {
          addOnElement.innerHTML = currency + '0';
        
      }
          
        }
      else{
        const discountTextElements = widgetElement.getElementsByClassName('sf-discount-text');
        for (let i = 0; i < discountTextElements.length; i++) {
              discountTextElements[i].style.display = 'block';
          }
      }
      cartButtonText(widgetElement,checkedCount+1)
      const addOnElement = widgetElement.querySelector(".sf-add-on-product");
      if (addOnElement) {
          const addOnText = checkedCount <= 1 ? "Add-on" : "Add-ons";
          addOnElement.innerHTML = `${checkedCount < 0 ? 0 : checkedCount} ${addOnText}`;
        
      }
      calculateTotalPrice(products, widgetElement,currency);
      fbtTablePriceCalculator(products, widgetElement,currency);
      
  };
  updateCheckedCount();
  // Event listener for change events
  widgetElement.addEventListener("change", updateCheckedCount);
}
async function fbtTablePriceCalculator(products, widgetElement,currency,totalPriceText) {
  let totalPrice = 0;
  let anyCheckboxChecked = false;
  if (widgetElement) {
      const productList = widgetElement.querySelector(`.sf-product-table`);
      if(productList)
      {
        const priceContainers = productList.querySelectorAll('.sf-table-price-container');    
        priceContainers.forEach(container => {
            if (!container.textContent.includes(currency)) {
              container.textContent = currency + container.textContent.trim();
          }
        });
      }
      const checkboxes = productList === null || productList === void 0 ? void 0 : productList.querySelectorAll('input[type="checkbox"]');
      checkboxes === null || checkboxes === void 0 ? void 0 : checkboxes.forEach((checkbox) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          if (checkbox && checkbox.checked) {
              anyCheckboxChecked = true;
              const productId = checkbox.getAttribute("id");
              const productItem = widgetElement.querySelector(`.sf-product-grid .sf-product-item[data-product-id="${productId}"]`);
              let product = products.find((product) => Number(product.id) === Number(productId));
              let selectedIndex = (_c = productItem === null || productItem === void 0 ? void 0 : productItem.querySelector(".sf-product-variants-dropdown")) === null || _c === void 0 ? void 0 : _c.selectedIndex;
              let price = (_f = (_e = (_d = product === null || product === void 0 ? void 0 : product.variants) === null || _d === void 0 ? void 0 : _d[selectedIndex]) === null || _e === void 0 ? void 0 : _e.variant_price) !== null && _f !== void 0 ? _f : (_h = (_g = product === null || product === void 0 ? void 0 : product.variants) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.variant_price;
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
              totalPriceText.innerHTML = `${totalPriceText} : <strong>${ currency + formattedTotalPrice}</strong>`;
      }
  }
}


async function firstItemPrice(products, widgetElement) {
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
async function fbtTableVariant( mainProductId, selectedIndex, currencySymbol, products) {
  const widgetElement = document.querySelector('.sf-container');
  const productListElement = widgetElement.querySelector("ul.sf-product-list");
  if (!productListElement)
      return;
  let productRef = products;
  let product = productRef.find((product) => Number(product.id) === Number(mainProductId));
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
async function fbtTableUtils(widgetElement,currency) {
  if (widgetElement) {
      const productLists = widgetElement.querySelectorAll("tr.sf-product-list-item");

      const productListElement = widgetElement.querySelector("tr.sf-product-list-item");
      if (!productListElement)
          return;
      const firstLiElement = productListElement.querySelector("td:first-child");
      if (!firstLiElement)
          return;
      const productNameSpan = productListElement.querySelector(".sf-product-title");
      if (productNameSpan && !productNameSpan.innerHTML.includes('<strong>This item:</strong>')) {
            productNameSpan.innerHTML = `<strong>This item:</strong> ${productNameSpan.innerHTML}`;
        }
  }
}
function fbtProductView(products,currency,totalPriceText) {
const productList = products
const widgetElement = document.querySelector('.sf-container');
calculateTotalPrice(productList, widgetElement,currency,totalPriceText);
checkboxTriggered(productList, widgetElement,currency)
fbtTableUtils(widgetElement,currency);
fbtTablePriceCalculator(productList, widgetElement,currency,totalPriceText);
  
}
