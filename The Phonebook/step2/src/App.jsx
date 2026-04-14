import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNamechange = (event)=> {
    setNewName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
// checking name if it exist and pop up alert
    const nameExists = persons.some(
      persons => persons.name.toLowerCase()=== newName.toLowerCase()
    )

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      return
    }

  const personObject = {
    name: newName
  }

  setPersons(persons.concat(personObject))
  setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: 
          <input value={newName} onChange={handleNamechange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map((persons, index) =>(
          <p key={index}>
            {persons.name}
          </p>
        ))}
      </div>
    </div>
  )
}

export default App