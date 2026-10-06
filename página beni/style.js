const WHATSAPP_NUMBER = "5492996282855";
const PLACEHOLDER = "A completar";

const PRODUCTS = [
  { id: "p01", image: "img/p01.jpg" },
  { id: "p02", image: "img/p02.jpg" },
  { id: "p03", image: "img/p03.jpg" },
  { id: "p04", image: "img/p04.jpg" },
  { id: "p05", image: "img/p05.jpg" },
  { id: "p06", image: "img/p06.jpg" },
  { id: "p07", image: "img/p07.jpg" },
  { id: "p08", image: "img/p08.jpg" },
  { id: "p09", image: "img/p09.jpg" },
  { id: "p10", image: "img/p10.jpg" },
  { id: "p11", image: "img/p11.jpg" },
  { id: "p12", image: "img/p12.jpg" },
  { id: "p13", image: "img/p13.jpg" },
  { id: "p14", image: "img/p14.jpg" },
  { id: "p15", image: "img/p15.jpg" },
  { id: "p16", image: "img/p16.jpg" },
  { id: "p17", image: "img/p17.jpg" },
  { id: "p18", image: "img/p18.jpg" },
  { id: "p19", image: "img/p19.jpg" },
].map((item, index) => ({
  ...item,
  name: PLACEHOLDER,
  price: PLACEHOLDER,
  description: PLACEHOLDER,
  title: "Producto " + String(index + 1).padStart(2, "0"),
}));

const cart = new Map();

const els = {
  grid: document.getElementById("product-grid"),
  drawer: document.getElementById("cart-drawer"),
  items: document.getElementById("cart-items"),
  count: document.getElementById("cart-count"),
  total: document.getElementById("cart-total"),
  form: document.getElementById("checkout-form"),
};

function productById(id) {
  return PRODUCTS.find((item) => item.id === id);
}

function cartQty() {
  let total = 0;
  cart.forEach((qty) => {
    total += qty;
  });
  return total;
}

function renderCatalog() {
  els.grid.innerHTML = PRODUCTS.map(
    (item) => `
      <article class="card">
        <figure>
          <img src="${item.image}" alt="${item.title}" />
        </figure>
        <div class="card-body">
          <p class="meta"><b>Nombre:</b> ${item.name}</p>
          <p class="meta"><b>Precio:</b> ${item.price}</p>
          <p class="meta"><b>Descripción:</b> ${item.description}</p>
          <button class="add-btn" type="button" data-add="${item.id}">Agregar al carrito</button>
        </div>
      </article>
    `
  ).join("");
}

function renderCart() {
  els.count.textContent = String(cartQty());

  if (cart.size === 0) {
    els.items.innerHTML = '<p class="cart-empty">El carrito está vacío.</p>';
    els.total.textContent = PLACEHOLDER;
    return;
  }

  els.items.innerHTML = Array.from(cart.entries())
    .map(([id, qty]) => {
      const item = productById(id);
      return `
        <article class="cart-row">
          <img src="${item.image}" alt="${item.title}" />
          <div>
            <h3>${item.title}</h3>
            <p>Nombre: ${item.name}</p>
            <p>Precio: ${item.price}</p>
            <button class="remove" type="button" data-remove="${id}">Quitar</button>
          </div>
          <div class="qty">
            <button type="button" data-dec="${id}">−</button>
            <span>${qty}</span>
            <button type="button" data-inc="${id}">+</button>
          </div>
        </article>
      `;
    })
    .join("");

  els.total.textContent = PLACEHOLDER;
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
}

function changeQty(id, delta) {
  const next = (cart.get(id) || 0) + delta;
  if (next <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, next);
  }
  renderCart();
}

function openCart() {
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
}

function sendOrder(event) {
  event.preventDefault();

  if (cart.size === 0) {
    openCart();
    return;
  }

  const name = document.getElementById("customer-name").value.trim() || PLACEHOLDER;
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const lines = Array.from(cart.entries()).map(([id, qty]) => {
    const item = productById(id);
    return `- ${item.title} x${qty}\n  Nombre: ${item.name}\n  Precio: ${item.price}\n  Descripción: ${item.description}`;
  });

  const message = [
    "Hola, quiero hacer un pedido en BP Imports NQN.",
    "",
    `Nombre: ${name}`,
    `Pago: ${payment}`,
    "",
    "Pedido:",
    ...lines,
    "",
    `Total: ${PLACEHOLDER}`,
  ].join("\n");

  window.open(
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message),
    "_blank"
  );
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
els.drawer.addEventListener("click", (event) => {
  if (event.target === els.drawer) closeCart();
});

document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  const inc = event.target.closest("[data-inc]");
  const dec = event.target.closest("[data-dec]");
  const remove = event.target.closest("[data-remove]");

  if (add) {
    addToCart(add.dataset.add);
    openCart();
  }
  if (inc) changeQty(inc.dataset.inc, 1);
  if (dec) changeQty(dec.dataset.dec, -1);
  if (remove) {
    cart.delete(remove.dataset.remove);
    renderCart();
  }
});

els.form.addEventListener("submit", sendOrder);

renderCatalog();
renderCart();