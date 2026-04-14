import { useState, useEffect } from 'react'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error('Error:', error))
  }, [])

  useEffect(() => {
    const results = countries.filter(c => 
      c.name.common.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCountries(results)
    setSelectedCountry(null)  
  }, [query, countries])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
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
          onShow={setSelectedCountry} 
        />
      </div>
    </div>
  )
}

const CountryView = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <p>capital {country.capital?.[0]}</p>
    <p>area {country.area}</p>
    <h3>languages:</h3>
    <ul>
      {Object.values(country.languages || {}).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt="flag" width="150" style={{ border: '1px solid #ccc' }} />
  </div>
)

const Display = ({ results, query, selectedCountry, onShow }) => {
  if (!query) return null

  // If a user clicked "show", prioritize that specific country view
  if (selectedCountry) {
    return <CountryView country={selectedCountry} />
  }

  if (results.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (results.length > 1) {
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map(c => (
          <li key={c.cca3} style={{ margin: '5px 0' }}>
            {c.name.common} {' '}
            <button onClick={() => onShow(c)}>show</button>
          </li>
        ))}
      </ul>
    )
  }

  if (results.length === 1) {
    return <CountryView country={results[0]} />
  }

  return <p>No matches found</p>
}

export default App