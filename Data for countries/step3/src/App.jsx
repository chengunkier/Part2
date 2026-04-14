import { useState, useEffect } from 'react'
import CountryList from './components/CountryList'
import Weather from './components/Weather'

const CountryDetail = ({ country }) => (
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
      alt="flag" 
      width="150" 
      style={{ marginBottom: '20px' }} 
    />
    
    {country.capital?.[0] && <Weather city={country.capital[0]} />}
  </div>
)

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => res.json())
      .then(data => setCountries(data))
  }, [])

  useEffect(() => {
    if (!query) {
      setFilteredCountries([])
      setSelectedCountry(null)
      return
    }

    const results = countries.filter(c => 
      c.name.common.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCountries(results)

    if (results.length === 1) {
      setSelectedCountry(results[0])
    } else {
      setSelectedCountry(null)
    }
  }, [query, countries])

  return (
    <div style={{ padding: '10px', fontFamily: 'sans-serif' }}>
      <div>
        find countries <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {selectedCountry ? (
          <CountryDetail country={selectedCountry} />
        ) : filteredCountries.length > 10 ? (
          <div>Too many matches, specify another filter</div>
        ) : (
          <CountryList 
            countries={filteredCountries} 
            onShow={(c) => setSelectedCountry(c)} 
          />
        )}
      </div>
    </div>
  )
}

export default App