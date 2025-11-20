export function getWindDirection(degree = 0) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.floor((degree || 0) / 22.5 + 0.5);
  return directions[index % 16];
}

/**
 * Safely map OpenWeather API response to a small DTO used by the UI.
 * Returns sensible defaults when input is null/undefined.
 */
export function getWeatherInfo(data = null) {
  // No data check
  if (!data) {
    return {
      cityName: "",
      country: "",
      tempC: 0,
      humidity: 0,
      icon: "",
      description: "",
      windKmh: 0,
      windDeg: 0,
    };
  }

  // Extract the weather properties
  const {
    name = "",
    sys: { country = "" } = {},
    main: { temp = 0, humidity = 0, feels_like = 0 } = {},
    weather: [firstWeather = {}] = [],
    wind: { speed = 0, deg = 0 } = {},
  } = data;

  // Return an object
  return {
    cityName: name,
    country,
    tempC: Math.round(temp),
    feelsLike: Math.round(feels_like),
    humidity,
    icon: firstWeather.icon || "",
    description: firstWeather.description || "",
    windKmh: Math.round((speed || 0) * 3.6),
    windDeg: deg || 0,
  };
}
