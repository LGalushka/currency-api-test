const container = document.getElementById("js-container-currency");
const btn = document.getElementById("js-update-btn");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");

const API_URL = "https://www.cbr-xml-daily.ru/daily_json.js";

async function fetchCurrency() {
  try {
    loader.classList.remove("hidden");
    errorMessage.classList.remove("errorMessage");
    container.innerHTML = "";
    btn.disabled = true;

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Ошибка при загрузке данных");
    }
    const data = await response.json();

    // Превращаем объект Valute в массив валют

    const currenciesArray = data.Valute;

    renderCurrencies(currenciesArray);
  } catch (error) {
    errorMessage.textContent =
      "Не удалось загрузить курсы валют. Попробуйте позже.";
    errorMessage.classList.add("errorMessage");
    console.error(error);
  } finally {
    loader.classList.add("hidden");
    btn.disabled = false;
  }
}

// функция для отрисовки DOM
function renderCurrencies(currencies) {
  container.innerHTML = "";
  const symbols = ["USD", "EUR", "GBP", "CNY"];

  symbols.forEach((code) => {
    const currency = currencies[code];
    const diff = currency.Value - currency.Previous;

    if (currency) {
      const currencyElement = document.createElement("li");
      currencyElement.classList.add("currency-card");

      const diffClass = diff > 0 ? "change-up" : "change-down";
      const diffSymbol = diff > 0 ? "▲" : "▼";

      currencyElement.innerHTML = `
    <h2>${currency.CharCode}</h2>
    <p>${currency.Name}</p>
    <p>Цена: ${currency.Value.toFixed(2)} руб.</p>
    <p class="price-change ${diffClass}">
    ${diffSymbol} ${Math.abs(diff).toFixed(4)}
    </p>
    `;
      container.appendChild(currencyElement);
    }
  });
}

fetchCurrency();
// Обработчик на кнопку, чтобы вызывать fetchCurrency
btn.addEventListener("click", fetchCurrency);
