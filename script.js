
var groups = [
  { id: "shampoo", title: "Шампуни", brand: "ECOLATIER URBAN" },
  { id: "care", title: "Уходовые средства", brand: "Bath Garden" },
  { id: "repair", title: "Восстанавливающие средства", brand: "ECOLATIER URBAN" },
  { id: "style", title: "Средства для укладки", brand: "CAFEMIMI" }
];

var products = [
  { id: 1, cat: "shampoo", img: "sh1", price: 40.99, name: "Объём и сила для сильных волос, 600 мл", tags: "объем тонк сила", text: "Придаёт волосам объём и силу." },
  { id: 2, cat: "shampoo", img: "sh2", price: 42.90, name: "Питательный шампунь для сухих волос, 600 мл", tags: "сух питан", text: "Питает и смягчает сухие волосы." },
  { id: 3, cat: "shampoo", img: "sh3", price: 35, name: "Мицеллярный шампунь для волос, 600 мл", tags: "жирн очищ ежедневн", text: "Мягко очищает волосы и кожу головы." },
  { id: 4, cat: "shampoo", img: "sh4", price: 37, name: "Шампунь для чувствительной кожи, 600 мл", tags: "чувствит кожа зуд", text: "Подходит для чувствительной кожи головы." },
  { id: 5, cat: "care", img: "ba1", price: 20.20, name: "Бальзам для волос укрепление & рост, 300 мл", tags: "рост выпад укреп", text: "Укрепляет волосы и помогает росту." },
  { id: 6, cat: "care", img: "ba2", price: 23.20, name: "Бальзам для волос блеск & увлажнение, 300 мл", tags: "блеск увлаж тускл", text: "Увлажняет и возвращает блеск." },
  { id: 7, cat: "care", img: "ba3", price: 25.90, name: "Бальзам для осветлённых волос, 300 мл", tags: "осветл блонд окраш", text: "Уход за осветлёнными волосами." },
  { id: 8, cat: "care", img: "ba4", price: 20, name: "Бальзам для волос густота & блеск, 300 мл", tags: "густ блеск", text: "Делает волосы гуще и блестящими." },
  { id: 9, cat: "repair", img: "re1", price: 30, name: "Бальзам для повреждённых волос, 400 мл", tags: "повреж секущ восстанов", text: "Восстанавливает повреждённые волосы." },
  { id: 10, cat: "repair", img: "re2", price: 30.99, name: "Бальзам для сухих волос, 400 мл", tags: "сух восстанов", text: "Возвращает мягкость сухим волосам." },
  { id: 11, cat: "repair", img: "re3", price: 39.99, name: "Бальзам-ополаскиватель для волос, 400 мл", tags: "ополаск легк ежедневн", text: "Лёгкий ополаскиватель для всех типов волос." },
  { id: 12, cat: "repair", img: "re4", price: 36, name: "Бальзам против тусклости волос, 400 мл", tags: "тускл блеск окраш", text: "Убирает тусклость, возвращает сияние." },
  { id: 13, cat: "style", img: "st1", price: 55, name: "Солевой текстурирующий спрей для волос, 200 мл", tags: "укладк локон пляж текстур", text: "Создаёт пляжные локоны и текстуру." },
  { id: 14, cat: "style", img: "st2", price: 50, name: "Разглаживающий спрей-термозащита, 200 мл", tags: "укладк термозащ гладк утюж фен", text: "Защищает от горячей укладки." },
  { id: 15, cat: "style", img: "st3", price: 50, name: "Спрей-праймер для волос, 200 мл", tags: "укладк объем прайм", text: "Основа для укладки, добавляет объём." },
  { id: 16, cat: "style", img: "st4", price: 50, name: "Сыворотка для укладки волос, 200 мл", tags: "укладк локон сыворотк", text: "Подчёркивает локоны и ухаживает." }
];

// ===== 2. Данные пользователя (сохраняются в браузере) =====
var cart = load("cart", {});          // { id товара: количество }
var profile = load("profile", { name: "", email: "", hair: "Не указан" });
var orders = load("orders", []);
var lastRecommended = [];             // что ИИ порекомендовал последним

function load(key, defaultValue) {
  try {
    var saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

// ===== 3. Вспомогательные функции =====
function money(n) { return n.toFixed(2).replace(".", ","); }
function getProduct(id) { return products.filter(function (p) { return p.id === id; })[0]; }

// ===== 4. Переключение страниц =====
function showPage(name) {
  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) pages[i].classList.add("hidden");
  document.getElementById("page-" + name).classList.remove("hidden");

  var buttons = document.querySelectorAll(".menu-btn");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.toggle("active", buttons[j].dataset.page === name);
  }
  if (name === "cart") showCart();
  if (name === "profile") showProfile();
  window.scrollTo(0, 0);
}

var menuButtons = document.querySelectorAll(".menu-btn");
for (var i = 0; i < menuButtons.length; i++) {
  menuButtons[i].onclick = function () { showPage(this.dataset.page); };
}
document.getElementById("open-ai").onclick = function () { showPage("ai"); };

// ===== 5. Каталог =====
function showCatalog(category) {
  var html = "";
  for (var g = 0; g < groups.length; g++) {
    if (category !== "all" && category !== groups[g].id) continue;
    html += '<h3 class="group-title">' + groups[g].title + '</h3>';
    html += '<p class="group-brand">' + groups[g].brand + '</p><div class="cards">';
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      if (p.cat !== groups[g].id) continue;
      html += '<div class="card">' +
        '<img src="images/' + p.img + '.png" alt="">' +
        '<div class="price">' + money(p.price) + ' руб.</div>' +
        '<div class="name">' + p.name + '</div>' +
        '<div class="card-buttons">' +
        '<button class="card-btn" onclick="showInfo(' + p.id + ')">Подробнее</button>' +
        '<button class="card-btn buy" onclick="addToCart(' + p.id + ')">В корзину</button>' +
        '</div></div>';
    }
    html += "</div>";
  }
  document.getElementById("catalog-list").innerHTML = html;
}

var chips = document.querySelectorAll(".chip");
for (var c = 0; c < chips.length; c++) {
  chips[c].onclick = function () {
    for (var k = 0; k < chips.length; k++) chips[k].classList.remove("active");
    this.classList.add("active");
    showCatalog(this.dataset.cat);
  };
}

// ===== 6. Информация о товаре (окно) =====
function showInfo(id) {
  var p = getProduct(id);
  document.getElementById("modal-content").innerHTML =
    '<img src="images/' + p.img + '.png" alt="">' +
    '<h3>' + p.name + '</h3>' +
    '<div class="price">' + money(p.price) + ' руб.</div>' +
    '<p>' + p.text + '</p>' +
    '<p>Применение: нанести на влажные волосы, вспенить и смыть. Возраст: 14+</p>' +
    '<button class="light-btn" onclick="addToCart(' + p.id + ')">В корзину</button>';
  document.getElementById("modal").classList.remove("hidden");
}
document.getElementById("modal-close").onclick = function () {
  document.getElementById("modal").classList.add("hidden");
};

// ===== 7. Корзина =====
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  save("cart", cart);
  updateCount();
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  save("cart", cart);
  updateCount();
  showCart();
}
function cartTotal() {
  var sum = 0;
  for (var id in cart) sum += getProduct(Number(id)).price * cart[id];
  return sum;
}
function updateCount() {
  var count = 0;
  for (var id in cart) count += cart[id];
  document.getElementById("cart-count").textContent = count;
}
function showCart() {
  var html = "";
  for (var id in cart) {
    var p = getProduct(Number(id));
    html += '<div class="cart-row"><img src="images/' + p.img + '.png" alt="">' +
      '<div class="info">' + p.name + '<br><b>' + money(p.price) + ' руб.</b></div>' +
      '<button class="qty-btn" onclick="changeQty(' + p.id + ', -1)">−</button> ' + cart[id] +
      ' <button class="qty-btn" onclick="changeQty(' + p.id + ', 1)">+</button></div>';
  }
  if (html === "") html = '<p class="empty">Корзина пуста. Добавьте товары из каталога.</p>';
  document.getElementById("cart-list").innerHTML = html;
  document.getElementById("cart-sum").textContent = money(cartTotal());
}
function makeOrder() {
  if (cartTotal() === 0) return false;
  orders.push({ number: orders.length + 1, sum: cartTotal(), items: Object.keys(cart).length, date: new Date().toLocaleDateString("ru-RU") });
  save("orders", orders);
  cart = {};
  save("cart", cart);
  updateCount();
  showCart();
  return true;
}
document.getElementById("order-btn").onclick = function () {
  if (makeOrder()) alert("Заказ оформлен! Спасибо!"); else alert("Корзина пуста");
};
document.getElementById("clear-btn").onclick = function () {
  cart = {}; save("cart", cart); updateCount(); showCart();
};

// ===== 8. Профиль =====
function showProfile() {
  document.getElementById("p-name").value = profile.name;
  document.getElementById("p-email").value = profile.email;
  document.getElementById("p-hair").value = profile.hair;
  document.getElementById("avatar").textContent = profile.name ? profile.name[0].toUpperCase() : "?";
  var html = "";
  for (var i = orders.length - 1; i >= 0; i--) {
    var o = orders[i];
    html += '<div class="order">Заказ №' + o.number + ' от ' + o.date + ' — товаров: ' + o.items + ', сумма ' + money(o.sum) + ' руб.</div>';
  }
  if (html === "") html = '<p class="empty">Заказов пока нет.</p>';
  document.getElementById("orders-list").innerHTML = html;
}
document.getElementById("save-profile").onclick = function () {
  profile.name = document.getElementById("p-name").value;
  profile.email = document.getElementById("p-email").value;
  profile.hair = document.getElementById("p-hair").value;
  save("profile", profile);
  document.getElementById("profile-msg").textContent = "Профиль сохранён";
  showProfile();
};

// ===== 9. ИИ-помощник (имитация: ответ по ключевым словам) =====
function addMessage(text, who, items) {
  var chat = document.getElementById("chat");
  var div = document.createElement("div");
  div.className = "msg " + who;
  div.innerHTML = text;
  if (items) {
    for (var i = 0; i < items.length; i++) {
      div.innerHTML += '<div class="mini"><img src="images/' + items[i].img + '.png" alt=""><span>' +
        items[i].name + ' — ' + money(items[i].price) + ' руб.</span>' +
        '<button class="card-btn buy" onclick="addToCart(' + items[i].id + ')">+</button></div>';
    }
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function has(text, words) {
  for (var i = 0; i < words.length; i++) if (text.indexOf(words[i]) !== -1) return true;
  return false;
}

function askAI(question) {
  var q = question.toLowerCase();
  addMessage(question, "user");

  // команды
  if (has(q, ["добавь", "в корзину", "беру"])) {
    if (lastRecommended.length === 0) { addMessage("Сначала опишите свои волосы, и я подберу товары.", "bot"); return; }
    for (var i = 0; i < lastRecommended.length; i++) addToCart(lastRecommended[i].id);
    addMessage("Готово! Добавила в корзину: " + lastRecommended.length + " шт. Скажите «оформи заказ», если всё верно.", "bot");
    return;
  }
  if (has(q, ["корзин"])) {
    addMessage("В корзине сумма: <b>" + money(cartTotal()) + " руб.</b> Можно сказать «оформи заказ».", "bot");
    return;
  }
  if (has(q, ["оформ", "заказ"])) {
    if (makeOrder()) addMessage("Заказ оформлен! Он появился в разделе «Профиль».", "bot");
    else addMessage("Корзина пока пуста.", "bot");
    return;
  }
  if (has(q, ["профил"])) { showPage("profile"); return; }

  // подбор ухода: ищем товары, у которых в tags есть часть слова из запроса
  var found = [];
  for (var j = 0; j < products.length; j++) {
    var tags = products[j].tags.split(" ");
    for (var t = 0; t < tags.length; t++) {
      if (q.indexOf(tags[t]) !== -1) { found.push(products[j]); break; }
    }
  }
  if (found.length === 0) {
    found = [products[2], products[5]];
    addMessage("Точно не поняла запрос, но для ежедневного ухода подойдут:", "bot", found);
  } else {
    found = found.slice(0, 3);
    addMessage("Подобрала уход под ваш запрос:", "bot", found);
  }
  lastRecommended = found;
  addMessage("Скажите «добавь в корзину», и я положу всё в корзину.", "bot");
}

function sendQuestion() {
  var input = document.getElementById("chat-input");
  if (input.value.trim() === "") return;
  askAI(input.value);
  input.value = "";
}
document.getElementById("chat-send").onclick = sendQuestion;
document.getElementById("chat-input").onkeydown = function (e) { if (e.key === "Enter") sendQuestion(); };

var quickButtons = document.querySelectorAll(".quick-btn");
for (var b = 0; b < quickButtons.length; b++) {
  quickButtons[b].onclick = function () { askAI(this.textContent); };
}

// ===== 10. Запуск =====
addMessage("Здравствуйте! Я ИИ-помощник «Жумайсымба». Расскажите про ваши волосы, и я подберу уход.", "bot");
showCatalog("all");
updateCount();
