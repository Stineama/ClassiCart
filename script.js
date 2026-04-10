const url = "https://dummyjson.com/products";
const saveKey = "classiCartItems";
const showNum = 20;

const app = {
  items: [],
  showItems: [],
  cart: JSON.parse(localStorage.getItem(saveKey)) || [],
  word: "",
  timer: null,
};

const el = {
  search: document.getElementById("search"),
  searchSm: document.getElementById("searchSm"),
  cards: document.getElementById("cards"),
  loadBox: document.getElementById("loadBox"),
  noItem: document.getElementById("noItem"),
  cartNum: document.getElementById("cartNum"),
  cartNumSm: document.getElementById("cartNumSm"),
  cartBtn: document.getElementById("cartBtn"),
  cartBtnSm: document.getElementById("cartBtnSm"),
  closeCart: document.getElementById("closeCart"),
  clearBtn: document.getElementById("clearBtn"),
  cartSide: document.getElementById("cartSide"),
  cover: document.getElementById("cover"),
  cartList: document.getElementById("cartList"),
  totalItem: document.getElementById("totalItem"),
  totalPrice: document.getElementById("totalPrice"),
  menuBtn: document.getElementById("menuBtn"),
  menu: document.getElementById("menu"),
  pop: document.getElementById("pop"),
  topBtn: document.getElementById("topBtn"),
  shop: document.getElementById("shop"),
};

function money(num) {
  return `$${Number(num).toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem(saveKey, JSON.stringify(app.cart));
}

function cartCount() {
  return app.cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
}

function cartTotal() {
  return app.cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
}

function showPop(msg) {
  el.pop.textContent = msg;
  el.pop.classList.remove("opacity-0", "translate-y-2");
  el.pop.classList.add("opacity-100", "translate-y-0");

  clearTimeout(app.timer);
  app.timer = setTimeout(function () {
    el.pop.classList.add("opacity-0", "translate-y-2");
    el.pop.classList.remove("opacity-100", "translate-y-0");
  }, 1800);
}

function loading() {
  el.loadBox.innerHTML = Array.from({ length: 8 })
    .map(function () {
      return `
      <div class="animate-pulse rounded-2xl bg-white p-3 shadow-[0_10px_25px_rgba(30,41,59,0.08)] sm:p-4">
        <div class="rounded-xl bg-slate-100 p-2 sm:p-3">
          <div class="aspect-square rounded-lg bg-slate-200"></div>
        </div>
        <div class="mt-3 h-3 w-16 rounded bg-slate-200"></div>
        <div class="mt-2 h-4 w-3/4 rounded bg-slate-200"></div>
        <div class="mt-4 h-4 w-20 rounded bg-slate-200"></div>
        <div class="mt-3 h-9 w-full rounded-full bg-slate-200"></div>
      </div>
    `;
    })
    .join("");
}

function stopLoading() {
  el.loadBox.innerHTML = "";
}

async function getItems() {
  loading();

  try {
    const firstRes = await fetch(`${url}?limit=1`);
    const firstData = await firstRes.json();
    const total = firstData.total || 0;

    const res = await fetch(`${url}?limit=${total}&sortBy=title&order=asc`);
    const data = await res.json();

    app.items = data.products || [];
    app.showItems = app.items.slice();
    filterItems();
  } catch (error) {
    console.log(error);
    el.cards.innerHTML = `
      <div class="col-span-full rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-600">
        There was an issue loading the product API. Please try again later.
      </div>
    `;
  } finally {
    stopLoading();
  }
}

function listToShow() {
  if (!app.word) {
    return app.showItems.slice(0, showNum);
  }
  return app.showItems;
}

function drawItems() {
  const list = listToShow();
  el.noItem.classList.toggle("hidden", list.length !== 0);

  if (list.length === 0) {
    el.cards.innerHTML = "";
    return;
  }

  el.cards.innerHTML = list
    .map(function (item, index) {
      const off = index < 10 ? Math.round(item.discountPercentage) : 0;
      const newPrice = off > 0 ? item.price * (1 - off / 100) : item.price;

      return `
      <section class="flex h-full flex-col rounded-2xl bg-white p-3 shadow-[0_10px_25px_rgba(30,41,59,0.08)] transition duration-300 hover:-translate-y-1 sm:p-4">
        
        <div class="relative rounded-xl bg-slate-100 p-2 sm:p-3">
          ${
            off > 0
              ? `<span class="absolute top-2 right-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                   -${off}%
                 </span>`
              : ``
          }

          <div class="aspect-square flex items-center justify-center overflow-hidden rounded-lg">
            <img src="${item.thumbnail}" alt="${item.title}" class="h-full w-full object-contain" />
          </div>
        </div>

        <div class="mt-3">
          <p class="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[10px]">
            ${item.brand || "Brand"}
          </p>

          <h3 class="mt-1 line-clamp-2 text-[11px] font-bold leading-tight text-slate-900 sm:text-xs">
            ${item.title}
          </h3>

          <div class="mt-2 flex items-end justify-between gap-2">
            <div class="min-w-0">
              ${
                off > 0
                  ? `<p class="text-[10px] text-slate-400 line-through">
                       ${money(item.price)}
                     </p>`
                  : ``
              }

              <p class="text-xs font-bold text-slate-900 sm:text-sm">
                ${money(newPrice)}
              </p>
            </div>

            <button 
              onclick="addToCart(${item.id})"
              class="shrink-0 rounded-full bg-blue-700 px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:opacity-90"
            >
              Add
            </button>
          </div>
        </div>
      </section>
    `;
    })
    .join("");
}

function filterItems() {
  const word = app.word.toLowerCase();

  app.showItems = app.items.filter(function (item) {
    return (
      item.title.toLowerCase().includes(word) ||
      (item.brand || "").toLowerCase().includes(word) ||
      item.category.toLowerCase().includes(word)
    );
  });

  drawItems();
}

function updateCart() {
  const num = cartCount();
  el.cartNum.textContent = num;
  el.cartNumSm.textContent = num;
  el.totalItem.textContent = num;
  el.totalPrice.textContent = money(cartTotal());
}

function addToCart(id) {
  const item = app.items.find(function (prod) {
    return prod.id === id;
  });

  if (!item) return;

  const oldItem = app.cart.find(function (prod) {
    return prod.id === id;
  });

  if (oldItem) {
    oldItem.quantity += 1;
  } else {
    app.cart.push({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.thumbnail,
      category: item.category,
      quantity: 1,
    });
  }

  saveCart();
  drawCart();
  updateCart();
  showPop("Product added to cart");
}

function removeItem(id) {
  app.cart = app.cart.filter(function (item) {
    return item.id !== id;
  });

  saveCart();
  drawCart();
  updateCart();
  showPop("Product removed from cart");
}

function plusItem(id) {
  const item = app.cart.find(function (prod) {
    return prod.id === id;
  });

  if (!item) return;
  item.quantity += 1;
  saveCart();
  drawCart();
  updateCart();
}

function minusItem(id) {
  const item = app.cart.find(function (prod) {
    return prod.id === id;
  });

  if (!item) return;

  if (item.quantity === 1) {
    removeItem(id);
    return;
  }

  item.quantity -= 1;
  saveCart();
  drawCart();
  updateCart();
}

function clearAll() {
  app.cart = [];
  saveCart();
  drawCart();
  updateCart();
  showPop("Cart cleared");
}

function drawCart() {
  if (app.cart.length === 0) {
    el.cartList.innerHTML = `
      <div class="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p class="text-lg font-bold">Your cart is empty.</p>
        <p class="mt-2 text-sm text-slate-500">Add a few products to see them here.</p>
      </div>
    `;
    return;
  }

  el.cartList.innerHTML = app.cart
    .map(function (item) {
      return `
      <div class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
        <div class="flex gap-4">
          <img src="${item.image}" alt="${item.title}" class="h-24 w-24 rounded-2xl object-cover">
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">${item.category}</p>
                <h4 class="mt-1 text-base font-bold">${item.title}</h4>
              </div>
              <button onclick="removeItem(${item.id})" class="text-sm font-semibold text-red-500">Remove</button>
            </div>

            <div class="mt-4 flex items-center justify-between gap-3">
              <div class="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
                <button onclick="minusItem(${item.id})" class="h-9 w-9 rounded-full text-lg font-semibold text-slate-700">−</button>
                <span class="min-w-8 text-center text-sm font-bold">${item.quantity}</span>
                <button onclick="plusItem(${item.id})" class="h-9 w-9 rounded-full text-lg font-semibold text-slate-700">+</button>
              </div>
              <p class="text-lg font-extrabold">${money(item.price * item.quantity)}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function openCart() {
  el.cartSide.classList.remove("translate-x-full");
  el.cover.classList.remove("opacity-0", "pointer-events-none");
  document.body.classList.add("overflow-hidden");
}

function closeCart() {
  el.cartSide.classList.add("translate-x-full");
  el.cover.classList.add("opacity-0", "pointer-events-none");
  document.body.classList.remove("overflow-hidden");
}

function syncSearch(value) {
  el.search.value = value;
  el.searchSm.value = value;
  app.word = value.trim();
  filterItems();

  if (app.word) {
    el.shop.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function showTopBtn() {
  if (window.scrollY > window.innerHeight * 0.6) {
    el.topBtn.classList.remove("hidden");
    el.topBtn.classList.add("flex");
  } else {
    el.topBtn.classList.add("hidden");
    el.topBtn.classList.remove("flex");
  }
}

function events() {
  el.search.addEventListener("input", function (e) {
    syncSearch(e.target.value);
  });

  el.searchSm.addEventListener("input", function (e) {
    syncSearch(e.target.value);
  });

  el.cartBtn.addEventListener("click", openCart);
  el.cartBtnSm.addEventListener("click", openCart);
  el.closeCart.addEventListener("click", closeCart);
  el.cover.addEventListener("click", closeCart);
  el.clearBtn.addEventListener("click", clearAll);

  el.menuBtn.addEventListener("click", function () {
    el.menu.classList.toggle("hidden");
  });

  el.topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", showTopBtn);
}

events();
drawCart();
updateCart();
getItems();
showTopBtn();

window.addToCart = addToCart;
window.removeItem = removeItem;
window.plusItem = plusItem;
window.minusItem = minusItem;
