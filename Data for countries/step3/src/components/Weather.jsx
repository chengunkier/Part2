import { useState, useEffect } from 'react';

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    if (!city) return;
    if (!apiKey) {
      setError("Missing API key. Please check your environment variables.");
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("API Key:", apiKey); // Debugging log
        console.log("Request URL:", `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`); // Debugging log

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch weather data");
        }

        setWeather(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching weather data");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, apiKey]);

  // UI States
  if (loading) return <div>Loading weather...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!weather) return <div>Enter a city to see weather</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
        Weather in {city}
      </h2>
      <div>Temperature {weather.main.temp} Celsius</div>
      {weather.weather && weather.weather[0] && (
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="weather icon"
          style={{ width: '100px' }}
        />
      )}
    </div>
  );
};

export default Weather;