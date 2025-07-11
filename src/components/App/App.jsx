import { useEffect, useRef, useState } from 'react';
import Card from '../Card/Card';
import Form from '../Form/Form';
import styles from './App.module.css';

function App() {
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const inputRef = useRef(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => inputRef.current.focus(), []);

  const handleCityInput = (e) => {
    setCityName(e.target.value);
    setError("");
  }

  const getWeatherData = async (e) => {
    e.preventDefault();
    const cleanText = cityName.trim();

    if(!cleanText){
      setError("Please enter a city.");
      return;
    }
    if(!apiKey) return;

    setIsLoading(true);
    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${cityName}&appid=${apiKey}`);
      if(!response.ok) throw new Error(`Could not find "${cityName}". Please try again.`);

      const {
        name: city,
        main: { temp, humidity, feels_like },
        sys: { country },
        weather: [{ description, icon }]
      } = await response.json();
      setError("");
      setWeather({ city, temp, feels_like, humidity, country, description, icon });
    }
    catch(error){
      setError(error.message);
      setWeather(null);
    }
    finally{
      setCityName("");
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className={styles.appTitle}>Weather App</h1>
      
      <Form
        value={cityName}
        onChange={handleCityInput}
        onSubmit={getWeatherData}
        isLoading={isLoading}
        ref={inputRef}
      />
      
      {isLoading && (
        <div className={styles.loadingDisplay}>
          <div className={styles.spinner} />
        </div>
      )}

      {error && <p className={styles.errorDisplay}>{error}</p>}
      {weather && !isLoading && <Card {...weather} />}
    </>
  );
}

export default App