import { useState, useEffect } from 'react';
import CountryList from './components/CountryList';
import Weather from './components/Weather';

const CountryDetail = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>

    <div>
      <div>Capital: {country.capital?.[0]}</div>
      <div>Area: {country.area}</div>
    </div>

    <h2>Languages</h2>
    <ul>
      {Object.values(country.languages || {}).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>

    <img src={country.flags.png} alt="flag" width="150" />

    {country.capital?.[0] && (
      <Weather city={country.capital[0]} />
    )}
  </div>
);

const App = () => {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Fetch all countries on initial load
  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error('Failed to fetch countries:', err));
  }, []);

  // Filter countries based on the query
  useEffect(() => {
    if (!query) {
      setFilteredCountries([]);
      setSelectedCountry(null);
      return;
    }

    const results = countries.filter(c =>
      c.name.common.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredCountries(results);

    if (results.length === 1) {
      setSelectedCountry(results[0]);
    } else {
      setSelectedCountry(null);
    }
  }, [query, countries]);

  return (
    <div style={{ padding: '10px' }}>
      <label>
        Find countries{' '}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div style={{ marginTop: '20px' }}>
        {selectedCountry ? (
          <CountryDetail country={selectedCountry} />
        ) : filteredCountries.length > 10 ? (
          <div>Too many matches, specify another filter</div>
        ) : filteredCountries.length > 0 ? (
          <CountryList
            countries={filteredCountries}
            onShow={(c) => setSelectedCountry(c)}
          />
        ) : (
          <div>No matches found</div>
        )}
      </div>
    </div>
  );
};

export default App;