import { useState, useEffect } from 'react'
import personService from './Services/PersonService'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addPerson} 
        newName={newName} 
        newNumber={newNumber}
        onNameChange={(e) => setNewName(e.target.value)} 
        onNumberChange={(e) => setNewNumber(e.target.value)} 
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App