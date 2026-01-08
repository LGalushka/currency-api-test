const container = document.getElementById("js-container-currency");
const btn = document.getElementById("js-update-btn");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");

let rates = [];

const API_URL = "https://www.cbr-xml-daily.ru/daily_json.js";

async function fetchCurrency() {
  try {
    loader.classList.remove("hidden");
    errorMessage.classList.add("errorMessage");
    container.innerHTML = "";
    btn.disabled = true;

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Ошибка при загрузке данных");
    }
    const data = await response.json();
    console.log(data.Valute.AUD);
    console.log(data.Valute.AUD.Name);
    console.log(data.Valute.AUD.CharCode);
    console.log(data.Valute.AUD.Value);
  } catch (error) {
    errorMessage.textContent =
      "Не удалось загрузить курсы валют. Попробуйте позже.";
    errorMessage.classList.remove("errorMessage");
    console.error(error);
  } finally {
    loader.classList.add("hidden");
    btn.disabled = false;
  }
}
fetchCurrency();
