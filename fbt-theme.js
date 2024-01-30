export async function calculateTotalPrice(products: any[],widgetElement:HTMLElement) {

  let totalPrice = 0;
  let anyCheckboxChecked = false;
  if (widgetElement) {
    const productList = widgetElement.querySelectorAll(
      `.sf-product-item`
    ) as NodeListOf<HTMLElement>;
    productList.forEach((productItem) => {
      const checkbox = productItem.querySelector<HTMLInputElement>(
        'input[type="checkbox"]'
      );
      
      if (checkbox && checkbox.checked) {
        anyCheckboxChecked = true;
        let productRef = products;
        
        let productId = productItem.getAttribute("data-product-id") as string;
        
        let product = productRef.find(
          (product: { id: number }) => Number(product.id) === Number(productId)
      );

        let selectedIndex = productItem?.querySelector<HTMLSelectElement>(
          ".sf-product-variants-dropdown"
        )?.selectedIndex as number;
        
        let price =
          product?.variants?.[selectedIndex]?.variant_price ??
          product?.variants?.[0]?.variant_price;
        
        if (price) totalPrice += price;
        
      }
    });

    const formattedTotalPrice = anyCheckboxChecked
      ? totalPrice.toFixed(2)
      : "0.00";
    const totalPriceText = widgetElement.querySelector(
      '.sf-total-price[data-tag="total-price"]'
    );

    firstItemPrice(products,widgetElement).then((firstItemPr) => {
      if (widgetElement) {
      const addOnElement = widgetElement.querySelector(".sf-add-on-product");

        if(addOnElement){
          addOnElement.innerHTML = `${products.length - 1} Add-ons`
        }
        // checkboxTriggered(products, doc)
        const addOnPrice = widgetElement.querySelector(
          ".sf-add-on-product-price"
        );
        const thisPrice = widgetElement.querySelector('.sf-this-product-price')
        if(thisPrice && firstItemPr){ 
          thisPrice.innerHTML = `$  ${firstItemPr}`;
        }
        if (addOnPrice) {
          if (firstItemPr !== undefined) {
            addOnPrice.innerHTML = `$  ${(
              totalPrice - firstItemPr
            ).toFixed(2)}
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
export async function checkboxTriggered(products: any[],widgetElement: HTMLElement) {

      // Function to calculate the number of checked products
      const updateCheckedCount = () => {
        const checkboxes = widgetElement.querySelectorAll(".sf-product-checkbox");
        let checkedCount = -1;
        checkboxes.forEach((checkbox) => {
          const productItem = checkbox.closest(".sf-product-item");
          if (!productItem) return;
          const productImage = productItem.querySelector(
            ".sf-product-image"
          ) as HTMLImageElement | null;
          const productDropdown = productItem.querySelector(
            ".sf-product-variants-dropdown"
          ) as HTMLElement;
          const productTitle = productItem.querySelector(
            ".sf-product-title"
          ) as HTMLElement;
          const productPrice = productItem.querySelector(
            ".sf-price-container"
          ) as HTMLElement;
          const checkboxInput = checkbox as HTMLInputElement;
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
        calculateTotalPrice(products,widgetElement);
        fbtTablePriceCalculator(products,widgetElement);
      };
      updateCheckedCount();
      // Event listener for change events
      widgetElement.addEventListener("change", updateCheckedCount);
    
  
}
export async function fbtTablePriceCalculator(products: any[],widgetElement: HTMLElement) {
  let totalPrice = 0;
  let anyCheckboxChecked = false;
  if (widgetElement) {
    const productList = widgetElement.querySelector(
      `ul.sf-product-list`
    ) as HTMLElement;
    
    const checkboxes = productList?.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );
    checkboxes?.forEach((checkbox) => {
      if (checkbox && checkbox.checked) {
        anyCheckboxChecked = true;
        const productId = checkbox.getAttribute("id");
        const productItem = widgetElement.querySelector(
          `.sf-product-grid .sf-product-item[data-product-id="${productId}"]`
        );
        let productRef = products;

        let product = productRef.find(
          (product: any) => Number(product.id) === Number(productId)
        );
        let selectedIndex = productItem?.querySelector<HTMLSelectElement>(
          ".sf-product-variants-dropdown"
        )?.selectedIndex as number;
        let price =
          product?.variants?.[selectedIndex]?.variant_price ??
          product?.variants?.[0]?.variant_price;
        if (price) totalPrice += price;
      }
    });
    if (productList) {
      const formattedTotalPrice = anyCheckboxChecked
        ? totalPrice.toFixed(2)
        : "0.00";
      const totalPriceText = widgetElement.querySelector(
        '.sf-total-price[data-tag="total-price"]'
      );
      if (totalPriceText)
        totalPriceText.innerHTML = `<strong>Total Price:</strong>${
          '$' + formattedTotalPrice
        }`;
    }
  }
}
export async function disableCheckbox(widgetElement:HTMLElement) {
  if (widgetElement) {
    const firstProductElement = widgetElement.querySelector(
      ".sf-product-item"
    ) as HTMLElement;
    
    let checkbox = firstProductElement?.querySelector(
      ".sf-product-checkbox"
    ) as HTMLInputElement;

    if(checkbox === null){
      const tableProduct = widgetElement.querySelector(
        ".sf-product-list"
      ) as HTMLElement;
      checkbox = tableProduct?.querySelector(
        ".sf-product-checkbox"
      ) as HTMLInputElement;
    }
    
    if (checkbox) {
      checkbox.disabled = true;
      checkbox.style.cursor = "not-allowed";
    }
  }
}
export async function firstItemPrice(products:any[],widgetElement:HTMLElement): Promise<number | undefined> {

  if (widgetElement) {
    const firstProductElement = widgetElement.querySelector(
      ".sf-product-item"
    ) as HTMLElement;
    const selectedIndex = firstProductElement?.querySelector<HTMLSelectElement>(
      ".sf-product-variants-dropdown"
    )?.selectedIndex as number;
    const productId = firstProductElement.getAttribute(
      "data-product-id"
    ) as string;
    let productRef = products;
    let product = productRef.find((product: any) => Number(product.id) === Number(productId));
    return (
      product?.variants?.[selectedIndex]?.variant_price ??
      product?.variants?.[0]?.variant_price
    );
  }
  return undefined;
}
export async function fbtTableVariant(
  widgetElement: HTMLElement,
  mainProductId: string,
  selectedIndex: number,
  currencyRate: number,
  currencySymbol: any,
  products:any[],
) {
  const productListElement = widgetElement.querySelector("ul.sf-product-list");
  if (!productListElement) return;
  let productRef = products;
  let product = productRef.find((product: any) => product.id === mainProductId);
  const selectedVariant = product?.variants[selectedIndex];
  const variantElement = productListElement.querySelector(
    `[data-product-id="${mainProductId}"]`
  );
  const priceElement = variantElement?.querySelector(
    '[data-tag="price"]'
  ) as HTMLElement;
  if (priceElement) {
    const currentPrice = selectedVariant.variant_price * currencyRate;
    if (
      variantElement &&
      variantElement.querySelector(`[data-tag="on-sale"]`)
    ) {
      return;
    }
    priceElement.textContent = `${currencySymbol}${currentPrice.toFixed(2)}`;
  }
}
export async function fbtTableUtils(widgetElement:HTMLElement) {
  if (widgetElement) {
    const productListElement =
      widgetElement.querySelector("ul.sf-product-list");
    if (!productListElement) return;
    const firstLiElement = productListElement.querySelector("li:first-child");
    if (!firstLiElement) return;
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


export  function fbtProductView(products:any[]){

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
  function renderFbt(doc){
    
  const widgetElement = doc.querySelector('.sf-container');  
    calculateTotalPrice(products, widgetElement);
    disableCheckbox(widgetElement)
    fbtTableUtils(widgetElement)
    fbtTablePriceCalculator(products,widgetElement)
  }
}
