import { useState, useEffect } from 'react'

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (!city) return

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error("Error fetching weather", err))
  }, [city, api_key])

  if (!weather || !weather.main) {
    return <div>Loading weather...</div>
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
        Weather in {city}
      </h2>
      <div>Temperature {weather.main.temp} Celsius</div>
      <img 
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
        alt="weather icon" 
        style={{ width: '100px' }}
      />
      <div>Wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default Weather