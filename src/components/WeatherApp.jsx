import React, { useRef, useState, useEffect } from "react";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Auto-focus to the input field on startup.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handles the city entered.
  const handleCityInput = async (e) => {
    e.preventDefault(); // Prevent default form behaviour
    const trimmed = city.trim(); // Grab the city entered and trim any unnecessary whitespaces.

    // If there's no city entered, Exit handleCityInput function
    if (!trimmed) return;

    // Quit if already fetching
    if (isLoading) return;

    setIsLoading(true); // Start the loading spinner
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmed}&appid=${apiKey}&units=metric`;
      const response = await fetch(url); // Fetch weather data
      if (!response.ok) {
        throw new Error(`Could not locate "${city}". Please try again.`);
      }

      // Parse the response into object
      const data = await response.json();
      setWeather(data); // Store the data object into weather
      setError(""); // Reset any previous errors
    } catch (error) {
      console.error(error);
      setError(error.message);
      setWeather(null);
    } finally {
      setCity(""); // Clear input field before/after entering city.
      setIsLoading(false); // Stop the loading spinner after fetch is success/fail.
    }
  };

  // Returns the correct direction of wind.
  const getCardinalDirection = (deg) => {
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
    const index = Math.floor((deg + 11.25) / 22.5);
    return directions[index % 16];
  };

  return (
    <>
      <h1 className="app-title">Weather App</h1>

      <form
        className="weather-form"
        onSubmit={handleCityInput}
        role="search"
        aria-label="Search for city weather"
      >
        <input
          type="text"
          id="city-input"
          placeholder="Enter city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setError("");
          }}
          ref={inputRef}
          aria-label="City name"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          style={
            isLoading
              ? { cursor: "not-allowed", backgroundColor: "gray" }
              : { cursor: "pointer" }
          }
          aria-label="Search city"
        >
          Search
        </button>
      </form>

      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}

      {isLoading && (
        <div
          className="loading-wrapper"
          role="status"
          aria-live="polite"
          aria-busy={isLoading}
          aria-label="Loading weather data"
        >
          <div className="loading-wrapper__spinner" aria-hidden="true"></div>
        </div>
      )}

      {weather && !isLoading && (
        <div
          className="card"
          role="region"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Current weather in ${weather.name}`}
        >
          <h1 className="card__city">
            {weather.name}, {weather.sys.country}
          </h1>
          <p className="card__temp">{Math.round(weather.main.temp)}°C</p>
          <p className="card__humidity">humidity: {weather.main.humidity}%</p>
          <p className="card__wind">
            Wind: {Math.round(weather.wind.speed * 3.6)} km/h (
            {getCardinalDirection(weather.wind.deg)})
          </p>
          <p className="card__description">{weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="card__weather-icon"
          />
        </div>
      )}
    </>
  );
}

export default WeatherApp;
