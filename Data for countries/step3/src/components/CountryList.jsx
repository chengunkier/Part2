const CountryList = ({ countries, onShow }) => {
    return (
      <div>
        {countries.map(c => (
          <div key={c.cca3} style={{ marginBottom: '5px' }}>
            {c.name.common} <button onClick={() => onShow(c)}>show</button>
          </div>
        ))}
      </div>
    )
  }
  
  export default CountryList