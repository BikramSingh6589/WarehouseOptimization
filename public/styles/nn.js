// -----------------------------------------------------------------------------
// Section 1: Popup Toggle Handlers for Add & Retrieve Product
// -----------------------------------------------------------------------------

{/* <script src="https://cdn.lordicon.com/lordicon.js"></script>; */}

var main = document.querySelector(".main");
var addButton = document.querySelector("#AddProduct");
var retrieveButton = document.querySelector("#RetrieveProduct");
var popUpContentAdd = document.querySelector(".popupMenu");
var popUpContentRemove = document.querySelector(".RetrieveItems");
let flag = 0;

// Show Add Product Popup
addButton.addEventListener("click", (e) => {
  e.stopPropagation();
  flag = 1;
  popUpContentAdd.style.display = "flex";
  setTimeout(() => {
    popUpContentAdd.classList.add("show");
  }, 10);
});

// Show Retrieve Product Popup
retrieveButton.addEventListener("click", (e) => {
  e.stopPropagation();
  flag = 1;
  popUpContentRemove.style.display = "flex";
  setTimeout(() => {
    popUpContentRemove.classList.add("show");
  }, 10);
});

// Hide popups on outside click
document.addEventListener("click", () => {
  if (flag === 1) {
    flag = 0;
    popUpContentAdd.classList.remove("show");
    popUpContentRemove.classList.remove("show");

    const productFound = document.querySelector(".ProductFound");
    if (productFound) {
      productFound.classList.remove("show");
      setTimeout(() => (productFound.style.display = "none"), 300);
    }

    setTimeout(() => {
      popUpContentAdd.style.display = "none";
      popUpContentRemove.style.display = "none";
    }, 300);
  }
});

// Prevent click inside popup from closing it
popUpContentAdd.addEventListener("click", (e) => e.stopPropagation());
popUpContentRemove.addEventListener("click", (e) => e.stopPropagation());

// -----------------------------------------------------------------------------
// Section 2: Add Products to List and Render them
// -----------------------------------------------------------------------------

const products = [];

function addToList() {
  let nameInput = document.getElementById("ProductName");
  let quantInput = document.getElementById("quant");
  let sizeInput = document.getElementById("size");
  let priorityInput = document.getElementById("priority");
  let weightInput = document.getElementById("weight");

  let name = nameInput.value;
  let quant = +quantInput.value;
  let size = +sizeInput.value;
  let priority = priorityInput.value;
  let weight = +weightInput.value;

  if (!name || !quant || !size || !priority || !weight) {
    alert("Please fill all fields.");
    return;
  }

  products.push({ name, quant, size, priority, weight });
  renderList();

  // Clear input fields
  nameInput.value = "";
  quantInput.value = "";
  sizeInput.value = "";
  // priorityInput.value = "";
  weightInput.value = "";
}

function renderList() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((p, i) => {
    list.innerHTML += `
            <div class="product-card">
                <strong>#${i + 1}</strong> ${p.name} - ${p.quant} pcs
                <span>(${p.priority})</span>
                 <lord-icon class = "del-icon"
    src="https://cdn.lordicon.com/jzinekkv.json"
    trigger="hover"
    colors="primary:#c71f16,secondary:#c71f16"
    style="width:1.5rem;height:1.5rem;margin-left:1rem;cursor:pointer;">
</lord-icon>
            </div>
        `;
  });
}

// -----------------------------------------------------------------------------
// Section 3: Delete Product from List When Trash Icon Clicked
// -----------------------------------------------------------------------------

document.getElementById("productList").addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("del-icon")) {
    const card = e.target.closest(".product-card");
    const index = Array.from(this.children).indexOf(card);

    if (index !== -1) {
      products.splice(index, 1); // Remove product from array
      renderList(); // Refresh the product list
    }
  }
});

// -----------------------------------------------------------------------------
// Section 4: Submit Products as a Batch
// -----------------------------------------------------------------------------

function submitBatch() {
  if (products.length === 0) {
    alert("No products to submit.");
    return false;
  }

  document.getElementById("productsData").value = JSON.stringify(products);
  return true;
}

// -----------------------------------------------------------------------------
// Section 5: Retrieve Product from Backend
// -----------------------------------------------------------------------------

document
  .getElementById("retrieveForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);
    const productName = data.get("productName");

    const res = await fetch("/retrieve-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName }),
    });

    const result = await res.json();
    const resultDiv = document.getElementById("productResult");

    if (result.success) {
      resultDiv.innerHTML = `
            <h1>Item is Found at <span>Rack ${result.rackName}</span> and <span>Bin: ${result.binName}</span></h1>
        `;
    } else {
      resultDiv.innerHTML = `<h1>${result.message}</h1>`;
    }
  });
