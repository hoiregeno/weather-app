import styles from './Card.module.css';

function Card({ city, country, temp, feels_like, humidity, description, icon }) {
  return (
    <div className={styles.card}>
      <h1 className={styles.cityDisplay}>
        {`${city}, ${country}`}
      </h1>
      <h2 className={styles.tempDisplay}>
        {`${Math.round(temp)}°C`}
      </h2>
      <p className={styles.feelsLikeDisplay}>
        {`Feels like: ${Math.round(feels_like)}°C`}
      </p>
      <p className={styles.humidityDisplay}>
        {`Humidity: ${humidity}%`}
      </p>
      <p className={styles.descDisplay}>
        {description}
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
      />
    </div>
  );
}

export default Card