const container = document.getElementById("js-container-currency");
const btn = document.getElementById("js-update-btn");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");
const amountInput = document.getElementById("js-amount-input");
const calcResult = document.getElementById("js-calc-result");

let allRates = {};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL = "https://www.cbr-xml-daily.ru/daily_json.js";

function filterCurrencyData(allRatesObject) {
  const requiredSymbols = ["USD", "EUR", "GBP", "CNY"];
  const filtered = {};

  requiredSymbols.forEach((symbol) => {
    if (allRatesObject[symbol]) {
      filtered[symbol] = allRatesObject[symbol];
    }
  });
  return filtered;
}

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

    await delay(1500);

    const allCurrenciesArray = data.Valute;

    // Фильтруем их и сохраняем только 4 нужные в глобальную переменную
    allRates = filterCurrencyData(allCurrenciesArray);

    // Передаем уже отфильтрованный объект в функцию отрисовки
    renderCurrencies(allRates);
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

// Функция калькулятора
function calculate(currencyCode) {
  const amount = parseFloat(amountInput.value);

  calcResult.classList.remove("result-error", "result-success");

  if (isNaN(amount) || amount <= 0) {
    calcResult.textContent = "Введите корректную сумму";
    calcResult.classList.add("result-error");
    return;
  }
  const rateValue = allRates[currencyCode].Value;
  const result = (amount / rateValue).toFixed(2);
  calcResult.textContent = `${amount} ₽ = ${result} ${currencyCode}`;
  calcResult.classList.add("result-success");
}

// функция для отрисовки DOM
function renderCurrencies(currencies) {
  container.innerHTML = "";

  Object.keys(currencies).forEach((code) => {
    const currency = currencies[code];
    const diff = currency.Value - currency.Previous;

    if (currency) {
      const currencyElement = document.createElement("li");
      currencyElement.classList.add("currency-card");

      const { CharCode, Name, Value } = currency;

      const isUp = diff > 0;
      const diffClass = isUp ? "change-up" : "change-down";
      const diffSymbol = isUp ? "▲" : "▼";

      currencyElement.innerHTML = `
    <h2>${CharCode}</h2>
    <p>${Name}</p>
    <p>Цена: ${Value.toFixed(2)} руб.</p>
    <p class="price-change ${diffClass}">
    ${diffSymbol} ${Math.abs(diff).toFixed(4)}
    </p>
    `;
      container.appendChild(currencyElement);
    }
  });
}

document.querySelectorAll(".js-calc-btn").forEach((calcBtn) => {
  calcBtn.addEventListener("click", (event) => {
    const currency = event.target.dataset.currency;
    calculate(currency);
  });
});

fetchCurrency();
// Обработчик на кнопку, чтобы вызывать fetchCurrency
btn.addEventListener("click", fetchCurrency);
