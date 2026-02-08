let particleInterval = null;
const apiKey = "31a2af07e78647ec40b0a12a520dec5a";

/* ------------------ DARK MODE ------------------ */
const themeToggle = document.getElementById("themeToggle");
const toggleIcon = themeToggle.querySelector(".toggle-icon");

themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    toggleIcon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

/* ------------------ SEARCH HISTORY ------------------ */
function loadHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    history.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.onclick = () => {
            document.getElementById("cityInput").value = city;
            getWeather();
        };
        list.appendChild(li);
    });
}

function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    if (!history.includes(city)) {
        history.unshift(city);
        if (history.length > 5) history.pop();
        localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
    loadHistory();
}

loadHistory();

/* ------------------ WEATHER SEARCH ------------------ */
async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;

    saveHistory(city);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    showWeather(data);
    getForecast(city);
    changeBackground(data.weather[0].main);
}

/* ------------------ DISPLAY WEATHER ------------------ */
function showWeather(data) {
    document.getElementById("weatherInfo").innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">
        <p class="temperature">${data.main.temp}°C</p>
        <p>${data.weather[0].main} — ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
    `;

    const temp = data.main.temp;
    if (temp > 20) startParticles("🥵");
    else if (temp >= 0) startParticles("☀️");
    else startParticles("❄️");
}

/* ------------------ FORECAST ------------------ */
async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    const daily = data.list.filter(f => f.dt_txt.includes("12:00:00")).slice(0, 3);

    daily.forEach(day => {
        const date = new Date(day.dt_txt);
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

        forecastDiv.innerHTML += `
            <div class="forecast-day enhanced">
                <p class="day-name">${weekday}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p class="temp-main">${Math.round(day.main.temp)}°C</p>
                <p class="extra">💨 ${day.wind.speed} m/s</p>
                <p class="extra">💧 ${day.main.humidity}%</p>
            </div>
        `;
    });
}

/* ------------------ BACKGROUND ------------------ */
function changeBackground(weather) {
    const body = document.body;

    if (weather.includes("Cloud")) body.style.background = "linear-gradient(#57d6d4, #71eeec)";
    else if (weather.includes("Rain")) body.style.background = "linear-gradient(#5bc8fb, #80eaff)";
    else if (weather.includes("Clear")) body.style.background = "linear-gradient(#f3b07c, #fcd283)";
    else if (weather.includes("Snow")) body.style.background = "linear-gradient(#aff2ff, #fff)";
}

/* ------------------ PARTICLES ------------------ */
function startParticles(symbol) {
    if (particleInterval) clearInterval(particleInterval);

    particleInterval = setInterval(() => {
        const p = document.createElement("div");
        p.className = "particle";
        p.textContent = symbol;
        p.style.left = Math.random() * 100 + "vw";
        p.style.fontSize = Math.random() * 20 + 20 + "px";
        p.style.animationDuration = Math.random() * 3 + 2 + "s";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 6000);
    }, 250);
}