import { useState, useEffect } from 'react'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  // 1. Fetch all countries on load
  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error("Error fetching country data", err))
  }, [])

  // 2. Filter countries based on search query
  useEffect(() => {
    const results = countries.filter(c => 
      c.name.common.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCountries(results)

    // Automatically select the country if there's only one match
    if (results.length === 1) {
      setSelectedCountry(results[0])
    } else {
      setSelectedCountry(null)
    }
  }, [query, countries])

  // 3. Fetch weather AUTOMATICALLY whenever selectedCountry changes
  useEffect(() => {
    if (selectedCountry && selectedCountry.capital) {
      const capital = selectedCountry.capital[0]
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
        .then(res => res.json())
        .then(data => {
          setWeather(data)
        })
        .catch(err => console.error("Error fetching weather", err))
    } else {
      setWeather(null)
    }
  }, [selectedCountry, api_key])

  return (
    <div style={{ padding: '10px', fontFamily: 'sans-serif' }}>
      <div>
        find countries <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <Display 
          results={filteredCountries} 
          query={query} 
          selectedCountry={selectedCountry}
          weather={weather}
          onShow={(c) => setSelectedCountry(c)} 
        />
      </div>
    </div>
  )
}

const CountryDetail = ({ country, weather }) => (
  <div>
    <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
      {country.name.common}
    </h1>
    
    <div style={{ marginBottom: '20px' }}>
      <div>Capital {country.capital?.[0]}</div>
      <div>Area {country.area}</div>
    </div>

    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Languages</h2>
    <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
      {Object.values(country.languages || {}).map(lang => (
        <li key={lang} style={{ marginBottom: '5px' }}>{lang}</li>
      ))}
    </ul>
    
    <img 
      src={country.flags.png} 
      alt={`Flag of ${country.name.common}`} 
      width="150" 
      style={{ marginBottom: '20px' }}
    />
    
    {weather && weather.main ? (
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          Weather in {country.capital[0]}
        </h2>
        <div>Temperature {weather.main.temp} Celsius</div>
        <img 
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
          alt="weather icon" 
          style={{ width: '100px' }}
        />
        <div>Wind {weather.wind.speed} m/s</div>
      </div>
    ) : (
      <div>Loading weather...</div>
    )}
  </div>
)

const Display = ({ results, query, selectedCountry, weather, onShow }) => {
  if (!query) return null
  
  // Always show the detail view if a country is "selected" (single match or button click)
  if (selectedCountry) {
    return <CountryDetail country={selectedCountry} weather={weather} />
  }

  if (results.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  return (
    <div>
      {results.map(c => (
        <div key={c.cca3} style={{ marginBottom: '5px' }}>
          {c.name.common} <button onClick={() => onShow(c)}>show</button>
        </div>
      ))}
    </div>
  )
}

export default App