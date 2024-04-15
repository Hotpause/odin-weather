import './style.css';


// cfa5d7ace87b423bbdc113909241204

function celsiusToFahrenheit(celsius) {
    return ((celsius * 9 / 5) + 32).toFixed(1);
}

// Function to convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(1);
}

async function fetchdata(location) {

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=cfa5d7ace87b423bbdc113909241204&q=${location}&days=3`)
        const data = await response.json();

        return data;

    } catch (error) {
        console.log('Error fetching data:', error);
        return null;
    }

};

function processdata(data) {

    const locationinfo = {
        name: data.location.name,
        country: data.location.country,

    };

    const current = {
        temperatureC: data.current.temp_c,
        temperatureF: celsiusToFahrenheit(data.current.temp_c),
        condition: data.current.condition.text,
        conditionicon: data.current.condition.icon,
    };

    const forecast = [];

    for (let i = 0; i < data.forecast.forecastday.length; i++) {

        const day = data.forecast.forecastday[i];
        const dayinfo = {
            date: day.date,
            maxTempC: day.day.maxtemp_c,
            maxTempF: celsiusToFahrenheit(day.day.maxtemp_c),
            minTempC: day.day.mintemp_c,
            minTempF: celsiusToFahrenheit(day.day.mintemp_c),
            condition: day.day.condition.text,
            conditionicon: day.day.condition.icon,
        };

        forecast.push(dayinfo);



    };


    return { locationinfo, current, forecast };
}


async function info(location) {
    const data = await fetchdata(location);
    if (data) {
        console.log(data);
    }
}

async function displayinfo(location) {

    const currentdatatab = document.querySelector(".currentinfo");
    const forecastdatatab = document.querySelector(".forecastinfo");

    const data = await fetchdata(location);

    if (data) {

        const { locationinfo, current, forecast } = processdata(data);
        let temperatureUnit = isCelsius ? "°C" : "°F";

        currentdatatab.innerHTML = `
        <h2>Current weather in ${locationinfo.name},${locationinfo.country} </h2>
        <p>Temperature: ${isCelsius ? current.temperatureC : current.temperatureF}${temperatureUnit}</p>
        <p>Condition:${current.condition} </p>
        <img src="${current.conditionicon}" alt="${current.condition}"></img>
        `;

        let forecasthtml = `<h2>Forecast Data</h2>`;

        forecast.forEach(day => {

            forecasthtml += `
                <div class="forecast-day">
                    <h3>${day.date}</h3>
                    <p>Max Temp: ${isCelsius ? day.maxTempC : day.maxTempF}${temperatureUnit}</p>
                    <p>Min Temp: ${isCelsius ? day.minTempC : day.minTempF}${temperatureUnit}</p>
                    <p>Condition: ${day.condition}</p>
                    <img src="${day.conditionicon}" alt="${day.condition}"></img>
                </div>`;
        });

        forecastdatatab.innerHTML = forecasthtml;
    };
};

let isCelsius = true;

// Event listener for Celsius button
document.getElementById("celsiusBtn").addEventListener("click", () => {
    if (!isCelsius) {
        isCelsius = true;
        document.getElementById("celsiusBtn").classList.add("active");
        document.getElementById("fahrenheitBtn").classList.remove("active");
        displayinfo(document.getElementById("locationInput").value);
    }
});

// Event listener for Fahrenheit button
document.getElementById("fahrenheitBtn").addEventListener("click", () => {
    if (isCelsius) {
        isCelsius = false;
        document.getElementById("fahrenheitBtn").classList.add("active");
        document.getElementById("celsiusBtn").classList.remove("active");
        displayinfo(document.getElementById("locationInput").value);
    }
});

const form = document.getElementById("weatherForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const locationvalue = document.getElementById("locationInput").value;
    displayinfo(locationvalue);


})

