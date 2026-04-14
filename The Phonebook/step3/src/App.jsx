import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '07-489-323-85' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNunber] = useState ('')

  const handleNamechange = (event)=> {
    setNewName(event.target.value)
  }

  const handleNumberchange = (event) => {
    setNewNunber(event.target.value)
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
      setNewNunber ('')
      return
    }

  const personObject = {
    name: newName,
    number: newNumber
  }

  setPersons(persons.concat(personObject))
  setNewName('')
  setNewNunber ('')
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
          number
          <input value={newNumber} onChange={handleNumberchange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map((persons, index) =>(
          <p key={index}>
            {persons.name} {persons.number}
          </p>
        ))}
      </div>
    </div>
  )
}

export default App