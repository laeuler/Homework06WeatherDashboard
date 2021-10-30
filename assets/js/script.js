// =========================== API Call, Dates and Visual Color Coding for UVI ===========================
const weatherCardsContainer = $("#weather-cards-container");

// API key needed to call open weather API
const API_KEY = "393609ac7b2e5f25ccdd00e626ee13dd";

const getCurrentData = function (name, forecastData) {
  return {
    name: name,
    temperature: forecastData.current.temp,
    wind: forecastData.current.wind_speed,
    humidity: forecastData.current.humidity,
    uvi: forecastData.current.uvi,
    date: getFormattedDate(forecastData.current.dt, "dddd DD.MM.YY HH:mm"),
    iconCode: forecastData.current.weather[0].icon,
    localTime: getFormattedDate(
      forecastData.current.dt + forecastData.timezone_offset - 7200,
      "HH:mm"
    ),
    feelsLike: forecastData.current.feels_like,
    //needed for background function
    sunrise: forecastData.current.sunrise,
    sunset: forecastData.current.sunset,
    localT: forecastData.current.dt + forecastData.timezone_offset - 7200,
    localRise:
      forecastData.current.sunrise + forecastData.timezone_offset - 7200,
    localSet: forecastData.current.sunset + forecastData.timezone_offset - 7200,
  };
};

// Get Date for current forcast in preferred format
const getFormattedDate = function (unixTimestamp, format = "dddd DD.MM.YY") {
  return moment.unix(unixTimestamp).format(format);
};

const getForecastData = function (forecastData) {
  const callback = function (each) {
    return {
      date: getFormattedDate(each.dt),
      temperature: each.temp.max,
      wind: each.wind_speed,
      humidity: each.humidity,
      iconCode: each.weather[0].icon,
    };
  };
  //forecast for next 5 days = slice from 1 to 6
  return forecastData.daily.slice(1, 6).map(callback);
};

const getWeatherData = async (cityName) => {
  const currentDataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  const currentDataResponse = await fetch(currentDataUrl);
  const currentData = await currentDataResponse.json();

  const lat = currentData.coord.lat;
  const lon = currentData.coord.lon;
  const name = currentData.name;

  const forecastDataUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  const forecastDataResponse = await fetch(forecastDataUrl);
  const forecastData = await forecastDataResponse.json();

  const current = getCurrentData(name, forecastData);
  const forecast = getForecastData(forecastData);
  console.log(current);
  console.log(forecast);

  return {
    current: current,
    forecast: forecast,
  };
};

// =========================== UVI Index Color Coding ===========================
const getUVIClassName = function (uvi) {
  if (uvi >= 0 && uvi < 3) {
    return "bg-success";
  } else if (uvi >= 3 && uvi < 6) {
    return "bg-warning";
  } else if (uvi >= 6 && uvi < 8) {
    return "bg-danger";
  } else {
    return "bg-dark text-white";
  }
};

// =========================== Manage Local Storage List of previous cities ===========================
const setCitiesInLS = function (cityName) {
  // get cities from LS and convert to JS OBject
  const cities = JSON.parse(localStorage.getItem("recentCities")) ?? [];

  // if city does not exist
  if (!cities.includes(cityName)) {
    // insert cityName in cities
    cities.push(cityName);

    // set cities in LS
    localStorage.setItem("recentCities", JSON.stringify(cities));
    console.log("recentCities");
  }
};

// =========================== Build up Current Weather Forecast Cards ===========================

// Card is being build
const renderCurrentWeatherCard = function (currentData) {
  // adjust background in dependency of sunrise, sunset and local Time
  // console.log("Sunrise: " + currentData.sunrise);
  // console.log("Sunset: " + currentData.sunset);
  // console.log("local Time: " + currentData.localT);

  var backgroundClass = "";
  var nextSun = "";

  if (
    currentData.localT <= currentData.sunset &&
    currentData.localT >= currentData.sunrise
  ) {
    backgroundClass = "day";
    nextSun = "Sunset: " + getFormattedDate(currentData.localSet, "HH:mm");
  } else {
    backgroundClass = "night";
    nextSun = "Sunrise: " + getFormattedDate(currentData.localRise, "HH:mm");
  }

  const currentWeatherCard = `<div id="current" class="card-body rounded mb-2 ${backgroundClass}">
    <h2 class="card-title">
        ${currentData.name} - ${currentData.localTime}
        <img src="https://openweathermap.org/img/w/${
          currentData.iconCode
        }.png" />
    </h2>
    <p class="card-text">Temp: ${currentData.temperature}&deg;C</p>
    <p class="card-text">Feels like: ${currentData.feelsLike}&deg;C</p>
    <p class="card-text">Wind: ${currentData.wind} KPH</p>
    <p class="card-text">Humidity: ${currentData.humidity}%</p>
    <p class="card-text">
    UV index: <span class="p-2 rounded ${getUVIClassName(currentData.uvi)}">${
    currentData.uvi
  }</span>
      </p>
      <p class="card-text">${nextSun}</p>
    </div>`;

  // Card is appended to Container for the forecast (next to the left side bar with history)
  weatherCardsContainer.append(currentWeatherCard);
};
// backgroundCurrent();

// =========================== Build up 5-day Weather Forecast Cards ===========================

// Build 5 Cards
const renderForecastWeatherCards = function (forecastData) {
  const constructForecastCard = function (each) {
    return `<div class="card m-1 forecast-card">
        <div class="card-body">
        <h5 class="card-title">${each.date}</h5>
        <p class="card-text">
            <img src="https://openweathermap.org/img/w/${each.iconCode}.png" />
        </p>
        <p class="card-text">Temp: ${each.temperature}&deg;C</p>
        <p class="card-text">Wind: ${each.wind} KPH</p>
        <p class="card-text">Humidity: ${each.humidity}%</p>
        </div>
    </div>`;
  };

  // Array of objects is converted to one string
  const forecastCards = forecastData.map(constructForecastCard).join("");

  // String is embedded in Container for the 5 Cards (layout set here)
  const forecastCardsContainer = `<div class="bg-light rounded">
    <h3 class="p-3 text-center">Forecast for the next 5 days:</h3>
    <div
        class="m-3 d-flex flex-wrap justify-content-left"
        id=""
    >${forecastCards}</div>
    </div>`;

  //Container around 5 cards is appended to Container for current and 5 days forecast
  weatherCardsContainer.append(forecastCardsContainer);
};

// constructing weather cards
const renderWeatherCards = function (weatherData) {
  renderCurrentWeatherCard(weatherData.current);
  renderForecastWeatherCards(weatherData.forecast);
};

// =========================== tbd ===========================
const renderRecentCities = function () {
  // get cities from LS
  const cities = JSON.parse(localStorage.getItem("recentCities")) ?? [];
  //console.log(cities);

  const citiesContainer = $("#city-list");
  // delete everything inside container before rebuild
  citiesContainer.empty();

  // per City a list item is Created with the name of the city
  const constructAndAppendCity = function (city) {
    const liEl = `<li data-city=${city} class="list-group-item">${city}</li>`;
    citiesContainer.append(liEl);
  };

  const handleClick = function (event) {
    const target = $(event.target);

    // if click is from li only
    if (target.is("li")) {
      // get city name
      //const cityName = target.data("city"); line responsible to fetch the name for calling API
      //runs into trouble with City Names with more than one word, like New York, San Francisco
      //old code only fetches the San and New
      const cityName = target.text();

      // render weather info with city name
      renderWeatherInfo(cityName);
    }
  };

  citiesContainer.on("click", handleClick);

  cities.forEach(constructAndAppendCity);
};

const renderWeatherInfo = async function (cityName) {
  const weatherData = await getWeatherData(cityName);

  weatherCardsContainer.empty();

  renderWeatherCards(weatherData);
};

const handleSearch = async function (event) {
  event.preventDefault();

  const cityName = $("#city-input").val();

  if (cityName) {
    //pull weather forecast for city name
    renderWeatherInfo(cityName);

    setCitiesInLS(cityName);
    //add newest Entry to recent Cities list after submit
    renderRecentCities();

    //clear entry field after search button is clicked
    $("#city-input").val("");
  }
};

// =========================== Clear Recent Cities ===========================
$("#clear").click(clearLocal);

function clearLocal() {
  var proceed = confirm(
    "Do you want to delete all the recent weather forecasts?"
  );
  if (proceed === true) {
    localStorage.clear();
    handleReady();
  } else {
    alert("Everything still there :-)");
  }
}
// =========================== Event Handler ===========================
const handleReady = function () {
  // render recent cities
  renderRecentCities();

  // get cities from LS
  const cities = JSON.parse(localStorage.getItem("recentCities")) ?? [];

  // if there are recent cities get the info for the most recent city
  if (cities.length) {
    const cityName = cities[cities.length - 1];
    renderWeatherInfo(cityName);
  }
};

// =========================== Event Handler ===========================
// When Search Button is clicked
$("#search-form").on("submit", handleSearch);
// When page gets loaded
$(document).ready(handleReady);
