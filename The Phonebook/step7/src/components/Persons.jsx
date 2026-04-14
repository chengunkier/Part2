const Persons = ({ persons }) => {
    return (
      <div>
        {persons.length > 0 ? (
          persons.map(person => (
            <p key={person.id}>
              {person.name} {person.number}
            </p>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    )
  }
  
  export default Persons