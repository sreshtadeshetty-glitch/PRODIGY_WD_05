const API_KEY = "53c01b7d80fac28e00d83a6a5ff6818d";

const BASE_URL =
"https://api.openweathermap.org/data/2.5/forecast";

/* FETCH WEATHER */

async function getWeather(){

    const cityInput =
    document.getElementById("cityInput").value;

    const city = cityInput || "London";

    try{

        const response = await fetch(
            `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
        );

        const data = await response.json();

        if(data.cod !== "200"){
            alert("City not found");
            return;
        }

        updateCurrent(data);
        update24Hours(data);
        update7Days(data);
        updateAI(data);

    }

    catch(error){

        console.log(error);

        alert("Error fetching weather");

    }

}

/* CURRENT WEATHER */

function updateCurrent(data){

    const current = data.list[0];

    document.getElementById("cityName").innerText =
    data.city.name;

    document.getElementById("temp").innerText =
    Math.round(current.main.temp) + "°C";

    document.getElementById("condition").innerText =
    current.weather[0].main;

    document.getElementById("feels").innerText =
    "Feels like " +
    Math.round(current.main.feels_like) + "°C";

    document.getElementById("humidity").innerText =
    current.main.humidity + "%";

    document.getElementById("wind").innerText =
    current.wind.speed + " km/h";

    document.getElementById("pressure").innerText =
    current.main.pressure + " hPa";

    document.getElementById("visibility").innerText =
    (current.visibility / 1000).toFixed(1) + " km";

    const condition = current.weather[0].main;

    let icon = "☀️";

    if(condition.includes("Cloud")) icon = "☁️";
    if(condition.includes("Rain")) icon = "🌧️";
    if(condition.includes("Thunder")) icon = "⛈️";
    if(condition.includes("Snow")) icon = "❄️";

    document.getElementById("weatherIcon").innerText =
    icon;

}

/* 24 HOUR FORECAST */

function update24Hours(data){

    const hourly =
    document.getElementById("hourlyForecast");

    hourly.innerHTML = "";

    for(let i = 0; i < 8; i++){

        const item = data.list[i];

        const time =
        new Date(item.dt * 1000)
        .toLocaleTimeString([],{
            hour:'2-digit',
            minute:'2-digit'
        });

        const temp =
        Math.round(item.main.temp);

        const weather =
        item.weather[0].main;

        let icon = "☀️";

        if(weather.includes("Cloud")) icon = "☁️";
        if(weather.includes("Rain")) icon = "🌧️";
        if(weather.includes("Thunder")) icon = "⛈️";
        if(weather.includes("Snow")) icon = "❄️";

        hourly.innerHTML += `

        <div class="hour-card">

            <p>${time}</p>

            <h2>${icon}</h2>

            <p>${temp}°C</p>

            <small>
                Rain:
                ${Math.round(item.pop * 100)}%
            </small>

        </div>

        `;

    }

}

/* 7 DAY FORECAST */

function update7Days(data){

    const daily =
    document.getElementById("dailyForecast");

    daily.innerHTML = "";

    for(let i = 0; i < 7; i++){

        const item = data.list[i * 4];

        if(!item) continue;

        const day =
        new Date(item.dt * 1000)
        .toLocaleDateString('en-US',{
            weekday:'short'
        });

        const max =
        Math.round(item.main.temp_max);

        const min =
        Math.round(item.main.temp_min);

        const weather =
        item.weather[0].main;

        let icon = "☀️";

        if(weather.includes("Cloud")) icon = "☁️";
        if(weather.includes("Rain")) icon = "🌧️";
        if(weather.includes("Thunder")) icon = "⛈️";
        if(weather.includes("Snow")) icon = "❄️";

        daily.innerHTML += `

        <div class="day-card">

            <h3>${day}</h3>

            <h1>${icon}</h1>

            <p>${max}° / ${min}°</p>

            <small>
                Rain:
                ${Math.round(item.pop * 100)}%
            </small>

        </div>

        `;

    }

}

/* AI SUGGESTIONS */

function updateAI(data){

    const current = data.list[0];

    const temp = current.main.temp;
    const wind = current.wind.speed;
    const weather = current.weather[0].main;

    let advice = "";

    if(temp > 38){

        advice = `
🔥 Extreme heat alert detected.

• Avoid direct sunlight from 12PM–4PM
• High dehydration risk
• Wear light cotton clothes
• Avoid long travel exposure
• UV radiation is dangerous today
        `;

    }

    else if(weather.includes("Rain")){

        advice = `
🌧 Heavy rain probability detected.

• Carry umbrella and waterproof gear
• Road visibility may decrease
• Traffic delays are likely
• Outdoor activities not recommended
        `;

    }

    else if(wind > 15){

        advice = `
💨 Strong wind conditions active.

• Avoid rooftop/open area activity
• Secure loose outdoor objects
• High-rise areas may experience turbulence
        `;

    }

    else{

        advice = `
✅ Weather conditions are stable.

• Great day for outdoor activities
• Comfortable temperature range
• Air quality acceptable
• Low weather risk expected today
        `;

    }

    document.getElementById("aiSuggestion").innerText =
    advice;

}

/* LOAD DEFAULT CITY */

getWeather();