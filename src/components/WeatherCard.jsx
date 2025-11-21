import React, { useEffect, useRef, useState } from "react";
import { getWeatherInfo, getWindDirection } from "../utils/weatherUtils";
import "../style/WeatherCard.css";

const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [err, setErr] = useState("");
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const cityInputRef = useRef(null);

  // auto-focus to city input on startup or reload
  useEffect(() => {
    cityInputRef.current?.focus();
  }, []);

  const handleCityInput = async (e) => {
    e.preventDefault();
    const cleanedCity = city.toLowerCase().trim();

    // Verify user input when nothing's entered
    if (cleanedCity === "") {
      setErr("Please enter a city.");
      return;
    }

    // Start loading
    setIsLoading(true);

    // Fetch weather data
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cleanedCity
      )}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Couldn't locate ${cleanedCity}.`);

      const data = await response.json();
      setWeather(data);
      setErr("");
      setCity("");
    } catch (error) {
      setErr(error?.message || "An error occurred while fetching weather.");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    cityName,
    country,
    tempC,
    feelsLike,
    humidity,
    icon,
    description,
    windKmh,
    windDeg,
  } = getWeatherInfo(weather);

  return (
    <>
      <h1 className="app-title">Weather App</h1>

      <form onSubmit={handleCityInput}>
        <input
          ref={cityInputRef}
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setErr("");
          }}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Searching" : "Search"}
        </button>
      </form>

      {err && <p>{err}</p>}

      {weather && (
        <div className="card">
          <h1 className="city-display">
            {cityName}, {country}
          </h1>

          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
          />

          <h2 className="temp-display">{tempC}°C</h2>

          <p className="desc-display">{description}</p>
          <p className="humidity-display">Humidity: {humidity}%</p>
          <p className="feels-like-display">Feels like: {feelsLike}°C</p>
          <p className="wind-display">
            Wind speed: {windKmh}km/h ({getWindDirection(windDeg)})
          </p>
        </div>
      )}
    </>
  );
};

export default WeatherCard;
