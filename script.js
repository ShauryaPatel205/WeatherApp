let particleInterval = null;
const apiKey = "31a2af07e78647ec40b0a12a520dec5a";

/* DARK MODE */
const themeToggle = document.getElementById("themeToggle");
const toggleIcon = themeToggle.querySelector(".toggle-icon");

themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    toggleIcon.textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
};

/* SEARCH HISTORY */
function loadHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    const list = document.getElementById("historyList");
    list.innerHTML = "";
    history.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.onclick = () => {
            cityInput.value = city;
            getWeather();
        };
        list.appendChild(li);
    });
}
loadHistory();

function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    if (!history.includes(city)) {
        history.unshift(city);
        if (history.length > 5) history.pop();
        localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
    loadHistory();
}

/* WEATHER FETCH */
async function getWeather() {
    const city = cityInput.value;
    if (!city) return;

    saveHistory(city);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    showWeather(data);
    getForecast(city);
    setWeatherBackground(data.weather[0].main);
}

/* WEATHER DISPLAY */
function showWeather(data) {
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">
        <p>${data.main.temp}°C</p>
        <p>${data.weather[0].description}</p>
    `;
}

/* LIVE BACKGROUND CONTROL */
function setWeatherBackground(condition) {
    const sun = document.querySelector(".sun");
    const clouds = document.querySelectorAll(".cloud");
    const rain = document.querySelector(".rain");
    const snow = document.querySelector(".snow");
    const thunder = document.querySelector(".thunder");
    const bg = document.getElementById("weather-bg");

    [sun, rain, snow, thunder].forEach(el => el.style.display = "none");
    clouds.forEach(c => c.style.display = "none");

    if (condition.includes("Clear")) {
        bg.style.background = "linear-gradient(#56ccf2,#2f80ed)";
        sun.style.display = "block";
    } 
    else if (condition.includes("Cloud")) {
        bg.style.background = "linear-gradient(#bdc3c7,#2c3e50)";
        clouds.forEach(c => c.style.display = "block");
    } 
    else if (condition.includes("Rain")) {
        bg.style.background = "linear-gradient(#232526,#414345)";
        rain.style.display = "block";
        clouds.forEach(c => c.style.display = "block");
    } 
    else if (condition.includes("Snow")) {
        bg.style.background = "linear-gradient(#83a4d4,#b6fbff)";
        snow.style.display = "block";
    } 
    else if (condition.includes("Thunder")) {
        bg.style.background = "linear-gradient(#000428,#004e92)";
        thunder.style.display = "block";
    }
}
