import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [msgType, setMsgType] = useState('success')

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const notify = (msg, type = 'success') => {
    setMessage(msg)
    setMsgType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            notify(`Updated ${newName}'s number`)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            notify(`Information of ${newName} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      personService.create(personObject).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        notify(`Added ${newName}`)
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        notify(`Deleted ${name}`)
      })
    }
  }

  const personsToShow = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Phonebook</h2>
      <Notification message={message} type={msgType} />
      
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />
      
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addPerson}
        nameValue={newName}
        nameOnChange={(e) => setNewName(e.target.value)}
        numberValue={newNumber}
        numberOnChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App