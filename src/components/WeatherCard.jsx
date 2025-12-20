import React, { useEffect, useRef, useState } from "react";
import { getWeatherInfo, getWindDirection } from "../utils/weatherUtils";
import "../style/WeatherCard.css";
import { SearchIcon } from "../assets/index";

// === 1. THE BACK KITCHEN (Logic Hook) ===
// This handles the "cooking" so the component just handles the "serving".
const useWeather = () => {
  // Manages raw ingredients (Data State)
  const [weather, setWeather] = useState(null);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Good discipline: Keep API keys secure (as much as possible in frontend)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // The Cooking Process (Async Logic)
  const fetchWeather = async (city) => {
    // Reset state before new fetch
    setIsLoading(true);
    setErr("");
    setWeather(null); // Clear old data while loading to avoid confusion

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Couldn't locate ${city}.`);

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setErr(error?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { weather, err, isLoading, fetchWeather, setErr };
};

const BUTTON_FILL_COLOR = { fill: "hsl(180, 100%, 10%)" };

// === 2. THE UI COMPONENT ===
const WeatherCard = () => {
  const [cityInput, setCityInput] = useState("");
  const { weather, err, isLoading, fetchWeather, setErr } = useWeather();
  const cityInputRef = useRef(null);

  // Auto-focus on startup
  useEffect(() => {
    cityInputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedCity = cityInput.toLowerCase().trim();

    if (!cleanedCity) {
      setErr("Please enter a city.");
      return;
    }

    fetchWeather(cleanedCity);
    setCityInput(""); // Clear input after search
  };

  const displayData = weather ? getWeatherInfo(weather) : null;

  return (
    <>
      <h1 className="app-title">Weather App</h1>

      <form onSubmit={handleSubmit} className="weather-form">
        <input
          ref={cityInputRef}
          type="text"
          placeholder="Enter city"
          value={cityInput}
          onChange={(e) => {
            setCityInput(e.target.value);
            // Optional: clear error as user types for better UX
            if (err) setErr("");
          }}
        />
        <button type="submit" disabled={isLoading} aria-label="Search City">
          <SearchIcon width={24} height={24} style={BUTTON_FILL_COLOR} />
        </button>
      </form>

      {/* Error message */}
      {err && (
        <p className="error-msg" role="alert">
          {err}
        </p>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}

      {/* Render only when we have processed data */}
      {displayData && (
        <div className="card">
          <h1 className="city-display">
            {displayData.cityName}, {displayData.country}
          </h1>

          <div className="icon-wrapper">
            {/* Added alt text fallback */}
            <img
              src={`https://openweathermap.org/img/wn/${displayData.icon}@2x.png`}
              alt={displayData.description || "Weather icon"}
              className="weather-icon"
            />
          </div>

          <h2 className="temp-display">{Math.round(displayData.tempC)}°C</h2>

          <p className="desc-display">{displayData.description}</p>
          <p className="humidity-display">Humidity: {displayData.humidity}%</p>
          <p className="feels-like-display">
            Feels like: {Math.round(displayData.feelsLike)}°C
          </p>
          <p className="wind-display">
            Wind speed: {displayData.windKmh}km/h (
            {getWindDirection(displayData.windDeg)})
          </p>
        </div>
      )}
    </>
  );
};

export default WeatherCard;
